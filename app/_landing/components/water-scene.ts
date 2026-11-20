export function createWaterScene(background: HTMLDivElement) {
  const images = [...background.querySelectorAll("img")];
  if (
    !images.length ||
    images.some((image) => !image.complete || !image.naturalWidth)
  )
    return null;
  const bounds = background.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return null;
  const ratio = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(bounds.width * ratio);
  canvas.height = Math.ceil(bounds.height * ratio);
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.scale(ratio, ratio);
  return {
    canvas,
    context,
    bounds,
    ratio,
    images,
    style: getComputedStyle(background),
  };
}

type WaterScene = NonNullable<ReturnType<typeof createWaterScene>>;

export function createWaterSceneLayer(scene: WaterScene) {
  const canvas = document.createElement("canvas");
  canvas.width = scene.canvas.width;
  canvas.height = scene.canvas.height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.scale(scene.ratio, scene.ratio);
  return { canvas, context };
}

export function drawWaterSceneImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  bounds: DOMRect,
  {
    opacity = 1,
    filter = "none",
    mirror = false,
  }: { opacity?: number; filter?: string; mirror?: boolean } = {},
) {
  const rect = image.getBoundingClientRect();
  const scale = Math.min(
    rect.width / image.naturalWidth,
    rect.height / image.naturalHeight,
  );
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = rect.left - bounds.left + (rect.width - width) / 2;
  const y = rect.top - bounds.top + (rect.height - height) / 2;
  context.save();
  context.globalAlpha = opacity;
  context.filter = filter;
  context.translate(mirror ? x + width : x, y);
  if (mirror) context.scale(-1, 1);
  context.drawImage(image, 0, 0, width, height);
  context.restore();
}
