"use client";

import Image, { getImageProps } from "next/image";
import {
  domAnimation,
  LazyMotion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties } from "react";
import { imageQuality } from "@/lib/image-quality";
import {
  projectFrame,
  type ArtworkBounds,
  type ArtworkLayer,
  type PortfolioProject,
} from "./portfolio-project";

const ease = [0.22, 1, 0.36, 1] as const;
const preparedImages = new Map<string, Promise<void>>();

function layerImage(
  layer: Pick<ArtworkLayer, "src" | "width" | "height" | "bounds">,
  frameWidth: number,
) {
  const fraction = layer.bounds[2] / frameWidth;
  return {
    src: layer.src,
    width: Math.ceil(layer.width),
    height: Math.ceil(layer.height),
    alt: "",
    quality: imageQuality,
    sizes: `(max-width: 599px) ${Math.ceil(fraction * 100)}vw, (max-width: 760px) ${Math.ceil(fraction * 74)}vw, (max-width: 1920px) ${Math.ceil(fraction * 39)}vw, ${Math.ceil(fraction * 750)}px`,
  };
}

function decodeImage(props: { src: string; srcSet?: string; sizes?: string }) {
  const key =
    props.src +
    (props.srcSet ? `:${window.innerWidth}:${window.devicePixelRatio}` : "");
  const existing = preparedImages.get(key);
  if (existing) return existing;
  const image = new window.Image();
  image.decoding = "async";
  if (props.sizes) image.sizes = props.sizes;
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;
  const ready = image.decode().catch((error) => {
    preparedImages.delete(key);
    throw error;
  });
  preparedImages.set(key, ready);
  return ready;
}

// Wait for the selected artwork to decode before starting its entrance.
// Repeated navigation shares the same in-flight requests.
export async function prepareProjectArtwork(project: PortfolioProject) {
  const scene = project.scene;
  if (!scene) {
    await decodeImage(
      getImageProps({
        src: project.image.src,
        width: project.image.width,
        height: project.image.height,
        alt: "",
        quality: imageQuality,
        sizes: "(max-width: 599px) 100vw, (max-width: 760px) 74vw, 39vw",
      }).props,
    );
    return;
  }
  await Promise.all(
    scene.layers.map((layer) =>
      decodeImage(getImageProps(layerImage(layer, scene.width)).props),
    ),
  );
}

function position(
  bounds: ArtworkBounds,
  width: number,
  height: number,
): CSSProperties {
  return {
    left: `${(100 * bounds[0]) / width}%`,
    top: `${(100 * bounds[1]) / height}%`,
    width: `${(100 * bounds[2]) / width}%`,
    height: `${(100 * bounds[3]) / height}%`,
  };
}

function movement(layer: ArtworkLayer, reduced: boolean): Variants {
  const kind = layer.motion;
  if (kind === "phone-emerge" || kind === "masked-rise") {
    const diagonal = kind === "phone-emerge";
    return {
      hidden: {
        x: reduced || !diagonal ? 0 : "18%",
        y: reduced ? 0 : diagonal ? "90%" : "92%",
        opacity: reduced ? 0 : 1,
        transition: { duration: reduced ? 0 : 0.22, delay: 0, ease },
      },
      shown: {
        x: reduced || !diagonal ? 0 : [null, "-0.15%", "0%"],
        y: reduced ? 0 : [null, "-0.4%", "0%"],
        opacity: 1,
        transition: {
          duration: reduced ? 0 : 0.9,
          delay: reduced ? 0 : layer.delay,
          times: [0, 0.84, 1],
          ease,
        },
      },
    };
  }
  const offset =
    kind === "diagonal"
      ? { x: "15%", y: "14%" }
      : kind === "hero"
        ? { x: 0, y: "9%" }
        : kind === "lift"
          ? { x: 0, y: "15%" }
          : kind === "circle"
            ? { x: "-3%", y: "5%" }
            : { x: 0, y: 14 };
  const scale =
    kind === "circle"
      ? 0.84
      : kind === "accent"
        ? 0.76
        : kind === "hero" || kind === "diagonal"
          ? 0.94
          : kind === "lift"
            ? 0.92
            : kind === "write" || kind === "backdrop"
              ? 1
              : 0.97;
  return {
    hidden: {
      opacity: 0,
      x: reduced ? 0 : offset.x,
      y: reduced ? 0 : offset.y,
      scale: reduced ? 1 : scale,
      ...(kind === "write" ? { clipPath: "inset(0 100% 0 0)" } : {}),
      transition: { duration: reduced ? 0 : 0.19, delay: 0, ease },
    },
    shown: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      ...(kind === "write" ? { clipPath: "inset(0 0% 0 0)" } : {}),
      transition: {
        duration: reduced
          ? 0
          : kind === "backdrop"
            ? 0.24
            : kind === "write"
              ? 0.18
              : kind === "hero" ||
                  kind === "circle" ||
                  kind === "diagonal" ||
                  kind === "lift"
                ? 0.72
                : 0.42,
        delay: reduced ? 0 : layer.delay,
        ease,
      },
    },
  };
}

function ArtworkPiece({
  layer,
  width,
  height,
  reduced,
}: {
  layer: ArtworkLayer;
  width: number;
  height: number;
  reduced: boolean;
}) {
  const clip = layer.clip;
  const viewport = clip?.bounds;
  const relative: ArtworkBounds = viewport
    ? [
        layer.bounds[0] - viewport[0],
        layer.bounds[1] - viewport[1],
        layer.bounds[2],
        layer.bounds[3],
      ]
    : layer.bounds;
  const piece = (
    <m.div
      data-artwork-layer={layer.id}
      className="absolute"
      variants={movement(layer, reduced)}
      style={position(
        relative,
        viewport?.[2] ?? width,
        viewport?.[3] ?? height,
      )}
    >
      <Image
        {...layerImage(layer, width)}
        loading="eager"
        draggable={false}
        className="block size-full"
      />
    </m.div>
  );
  return viewport ? (
    <div
      className="absolute"
      style={{
        ...position(viewport, width, height),
        ...(clip
          ? {
              overflow: "clip",
              borderRadius: `${clip.radius.map((r) => `${(100 * r) / clip.bounds[2]}%`).join(" ")} / ${clip.radius.map((r) => `${(100 * r) / clip.bounds[3]}%`).join(" ")}`,
            }
          : {}),
      }}
    >
      {piece}
    </div>
  ) : (
    piece
  );
}

export function ProjectArtwork({
  project,
  active,
  initial,
  widestAspect,
}: {
  project: PortfolioProject;
  active: boolean;
  initial: boolean;
  widestAspect: number;
}) {
  const reduced = !!useReducedMotion();
  const [width, height] = projectFrame(project);
  const scene = project.scene;
  const [left, top] = project.image.cardBounds;
  return (
    <LazyMotion features={domAnimation} strict>
      <m.figure
        data-project-artwork={project.name}
        data-active={active}
        aria-hidden={!active}
        className="pointer-events-none absolute top-1/2 left-1/2 h-full -translate-1/2"
        style={{ width: `${(100 * width) / height / widestAspect}%` }}
        initial={initial ? false : "hidden"}
        animate={active ? "shown" : "hidden"}
        variants={{
          shown: {
            visibility: "visible",
            transition: { when: "beforeChildren", duration: 0 },
          },
          hidden: {
            visibility: "hidden",
            transition: { when: "afterChildren", duration: 0 },
          },
        }}
      >
        <figcaption className="sr-only">{project.alt}</figcaption>
        {scene ? (
          scene.layers.map((layer) => (
            <ArtworkPiece
              key={layer.id}
              layer={layer}
              width={width}
              height={height}
              reduced={reduced}
            />
          ))
        ) : (
          <m.div
            className="absolute inset-0"
            variants={movement(
              {
                id: "temporary-poster",
                src: project.image.src,
                width: project.image.width,
                height: project.image.height,
                bounds: [0, 0, width, height],
                motion: "panel",
                delay: 0.04,
              },
              reduced,
            )}
          >
            <Image
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt=""
              loading="eager"
              quality={imageQuality}
              sizes="(max-width: 599px) 100vw, (max-width: 760px) 74vw, 39vw"
              draggable={false}
              className="absolute h-auto max-w-none"
              style={{
                width: `${(100 * project.image.width) / width}%`,
                left: `${(-100 * left) / width}%`,
                top: `${(-100 * top) / height}%`,
              }}
            />
          </m.div>
        )}
      </m.figure>
    </LazyMotion>
  );
}
