import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { artworkPlan } from "./portfolio-artwork-plan.mjs";

// Export on Windows with the attached FigCraft app, then prepare in WSL:
// node scripts/export-portfolio-artwork.mjs --export C:/path/to/raw
// node scripts/export-portfolio-artwork.mjs --prepare /mnt/c/path/to/raw
const [mode, directory] = process.argv.slice(2);
if (!["--export", "--prepare"].includes(mode) || !directory)
  throw new Error(
    "Expected --export <raw-directory> or --prepare <raw-directory>.",
  );
const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
await mkdir(directory, { recursive: true });

function indexNodes(page) {
  const nodes = new Map();
  function visit(node) {
    nodes.set(node.id, node);
    node.children?.forEach(visit);
  }
  visit(page);
  return nodes;
}

function boundsFor(ids, nodes) {
  const boxes = ids.map((id) => {
    const node = nodes.get(id);
    if (!node?.absoluteBounds) throw new Error(`Missing source node ${id}.`);
    return node.absoluteBounds;
  });
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  return [
    x,
    y,
    Math.max(...boxes.map((b) => b.x + b.width)) - x,
    Math.max(...boxes.map((b) => b.y + b.height)) - y,
  ];
}

function hasRaster(node) {
  return (
    node.fills?.some((fill) => fill.type === "image") ||
    node.children?.some(hasRaster)
  );
}

function unpack(result) {
  if (result.isError) throw new Error(JSON.stringify(result.content));
  return JSON.parse(result.content.find((block) => block.type === "text").text);
}

if (mode === "--export") {
  const cli = spawn(
    process.env.FIGCRAFT_CLI || "C:/Program Files/FigCraft/figcraft-cli.exe",
    ["mcp", "--attach", process.env.FIGCRAFT_PORT || "7979"],
    { windowsHide: true, stdio: ["pipe", "pipe", "inherit"] },
  );
  const pending = new Map();
  let sequence = 0;
  createInterface({ input: cli.stdout }).on("line", (line) => {
    const message = JSON.parse(line);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  const send = (message) =>
    cli.stdin.write(JSON.stringify({ jsonrpc: "2.0", ...message }) + "\n");
  const call = (method, params) =>
    new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, {
        resolve,
        reject,
        timer: setTimeout(
          () => reject(new Error(`${method} timed out`)),
          60000,
        ),
      });
      send({ id, method, params });
    });
  const tool = async (name, args) =>
    unpack(await call("tools/call", { name, arguments: args }));
  try {
    await call("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "Tactic artwork exporter", version: "1" },
    });
    send({ method: "notifications/initialized" });
    const document = await tool("inspect_document", { depth: 0 });
    const fontReport = await tool("run_command", {
      command: "file.fontReport",
      params: {},
    });
    if (fontReport.missing)
      throw new Error(`FigCraft reports ${fontReport.missing} missing fonts.`);
    const page = await tool("get_node", {
      document: document.id,
      id: 6137,
      depth: 30,
      fields: [
        "name",
        "type",
        "absoluteBounds",
        "visible",
        "fills",
        "cornerRadius",
        "cornerSmoothing",
      ],
      maxBytes: 6000000,
    });
    if (page.truncated) throw new Error("Source page response was truncated.");
    await writeFile(
      path.join(directory, "source-page.json"),
      JSON.stringify(page),
    );
    const nodes = indexNodes(page);
    const exports = [];
    const recorded = new Set();
    async function exportAsset(key, ids, forceFormat, source, padding) {
      if (recorded.has(key)) return;
      recorded.add(key);
      const format =
        (source ? "svg" : forceFormat) ||
        (ids.some((id) => hasRaster(nodes.get(id))) ? "png" : "svg");
      const filename = `${key}.${format}`;
      if (source) {
        await copyFile(path.join(root, source), path.join(directory, filename));
      } else
        await tool("export", {
          document: document.id,
          ids,
          format,
          scale: 0.5,
          includeBoundingBox: !padding,
          colorProfile: "srgb",
          path: path.resolve(directory, filename).replaceAll("\\", "/"),
        });
      const [x, y, width, height] = boundsFor(ids, nodes);
      exports.push({
        key,
        ids,
        filename,
        format,
        bounds: padding
          ? [
              x - padding[0],
              y - padding[1],
              width + padding[0] + padding[2],
              height + padding[1] + padding[3],
            ]
          : [x, y, width, height],
        scale: format === "svg" ? 1 : 0.5,
      });
      console.log(`Exported ${key}`);
    }
    for (const project of artworkPlan) {
      for (const layer of project.layers) {
        await exportAsset(
          `${project.slug}-${layer.asset ?? layer.name}`,
          layer.ids,
          undefined,
          layer.source,
          layer.exportPadding,
        );
        if (layer.clip && nodes.get(layer.clip).type !== "RECTANGLE")
          throw new Error(`Mask ${layer.clip} needs a vector mask export.`);
      }
      if (project.poster)
        await exportAsset(`${project.slug}-poster`, project.poster, "png");
    }
    await exportAsset("uninect-logo-symbol", [6351], "svg");
    await exportAsset("uninect-logo-wordmark", [6365], "svg");
    await writeFile(
      path.join(directory, "exports.json"),
      JSON.stringify(exports, null, 2),
    );
  } finally {
    for (const request of pending.values()) clearTimeout(request.timer);
    cli.stdin.end();
    cli.kill();
  }
} else {
  const { default: sharp } = await import("sharp");
  const page = JSON.parse(
    await readFile(path.join(directory, "source-page.json"), "utf8"),
  );
  const nodes = indexNodes(page);
  const exports = JSON.parse(
    await readFile(path.join(directory, "exports.json"), "utf8"),
  );
  const assets = new Map();
  const required = new Set(
    artworkPlan.flatMap((project) => [
      ...project.layers.map(
        (layer) => `${project.slug}-${layer.asset ?? layer.name}`,
      ),
      ...(project.poster ? [`${project.slug}-poster`] : []),
    ]),
  );
  const target = path.join(root, "public/images/projects/portfolio");
  await mkdir(target, { recursive: true });
  for (const entry of exports) {
    if (!required.has(entry.key)) continue;
    const input = path.join(directory, entry.filename);
    const [x, y, width, height] = entry.bounds;
    let asset;
    if (entry.format === "svg") {
      await copyFile(input, path.join(target, entry.filename));
      asset = {
        src: `/images/projects/portfolio/${entry.filename}`,
        width,
        height,
        bounds: entry.bounds,
      };
    } else {
      const image = sharp(input);
      const metadata = await image.metadata();
      // Trim only wholly transparent pixels; the original source coordinate stays recorded.
      const { data, info } = await image
        .trim({ threshold: 0 })
        .png()
        .toBuffer({ resolveWithObject: true });
      const scaleX = width / metadata.width;
      const scaleY = height / metadata.height;
      const filename = `${entry.key}.webp`;
      await sharp(data)
        .webp({ lossless: true })
        .toFile(path.join(target, filename));
      asset = {
        src: `/images/projects/portfolio/${filename}`,
        width: info.width,
        height: info.height,
        bounds: [
          x - info.trimOffsetLeft * scaleX,
          y - info.trimOffsetTop * scaleY,
          info.width * scaleX,
          info.height * scaleY,
        ],
      };
    }
    assets.set(entry.key, asset);
  }
  const scenes = {};
  for (const project of artworkPlan) {
    const frame = nodes.get(project.frame).absoluteBounds;
    const origin = [frame.x + project.bounds[0], frame.y + project.bounds[1]];
    const relative = (bounds) =>
      [bounds[0] - origin[0], bounds[1] - origin[1], bounds[2], bounds[3]].map(
        (n) => +n.toFixed(4),
      );
    scenes[project.slug] = {
      width: project.bounds[2],
      height: project.bounds[3],
      layers: project.layers.map((layer, index) => {
        const asset = assets.get(
          `${project.slug}-${layer.asset ?? layer.name}`,
        );
        const clip = layer.clip ? nodes.get(layer.clip) : undefined;
        if (clip && (clip.cornerRadius === undefined || clip.cornerSmoothing))
          throw new Error(
            `Mask ${clip.id} needs its exact supported corner geometry.`,
          );
        return {
          id: layer.name,
          src: asset.src,
          width: asset.width,
          height: asset.height,
          bounds: relative(asset.bounds),
          motion: layer.motion,
          delay:
            layer.delay ??
            (layer.motion === "backdrop"
              ? 0
              : layer.motion === "panel"
                ? index * 0.025
                : 0.1 + index * 0.014),
          ...(clip
            ? {
                clip: {
                  bounds: relative(boundsFor([clip.id], nodes)),
                  radius: Array.isArray(clip.cornerRadius)
                    ? clip.cornerRadius
                    : Array(4).fill(clip.cornerRadius),
                },
              }
            : {}),
        };
      }),
      ...(project.poster
        ? {
            poster: {
              ...assets.get(`${project.slug}-poster`),
              bounds: relative(assets.get(`${project.slug}-poster`).bounds),
            },
          }
        : {}),
    };
  }
  await writeFile(
    path.join(root, "app/_landing/project-artwork-data.ts"),
    "// Generated by scripts/export-portfolio-artwork.mjs from approved FigCraft layers.\nexport const projectArtwork = " +
      JSON.stringify(scenes, null, 2) +
      " as const;\n",
  );
  // Compose the actual exported symbol and wordmark, without recreating either.
  const symbol = await readFile(
    path.join(directory, "uninect-logo-symbol.svg"),
  );
  const wordmark = await readFile(
    path.join(directory, "uninect-logo-wordmark.svg"),
  );
  await writeFile(
    path.join(root, "public/images/landing/logo-uninect.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" width="787" height="148.48" viewBox="0 0 787 148.48"><defs><filter id="white"><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter></defs><g filter="url(#white)"><image width="149" height="148.48" href="data:image/svg+xml;base64,${symbol.toString("base64")}"/><image x="189" width="598" height="148.48" href="data:image/svg+xml;base64,${wordmark.toString("base64")}"/></g></svg>\n`,
  );
  console.log(
    `Prepared ${assets.size} assets for ${artworkPlan.length} projects.`,
  );
}
