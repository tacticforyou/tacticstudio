"use client";

import type { ReactNode } from "react";
import { WaterBackground } from "./water-background";
import {
  createWaterScene,
  createWaterSceneLayer,
  drawWaterSceneImage,
} from "./water-scene";

// Compose only the decorative assets. Layout continues to come from their DOM
// boxes; the shader never needs to capture or reconstruct interactive HTML.
function paintHeroScene(background: HTMLDivElement) {
  const scene = createWaterScene(background);
  if (!scene) return null;
  const { canvas, context, bounds, ratio, images, style } = scene;
  const token = (name: string) => style.getPropertyValue(name).trim();
  const linear = context.createLinearGradient(0, 0, 0, bounds.height);
  linear.addColorStop(0, token("--hero-gradient-start"));
  linear.addColorStop(0.18, token("--hero-gradient-start"));
  linear.addColorStop(0.49, token("--hero-gradient-upper"));
  linear.addColorStop(0.8, token("--hero-gradient-lower"));
  linear.addColorStop(1, token("--hero-gradient-end"));
  context.fillStyle = linear;
  context.fillRect(0, 0, bounds.width, bounds.height);
  const surface = createWaterSceneLayer(scene);
  if (!surface) return null;
  const { canvas: layer, context: layerContext } = surface;
  layerContext.fillStyle = token("--color-studio-mist");
  layerContext.fillRect(0, 0, bounds.width, bounds.height);
  layerContext.save();
  // CSS's default farthest-corner ellipse uses the farthest-side aspect ratio.
  layerContext.translate(bounds.width * 0.5, bounds.height * 1.15);
  layerContext.scale(
    bounds.width * 0.5 * Math.SQRT2,
    bounds.height * 1.15 * Math.SQRT2,
  );
  const radial = layerContext.createRadialGradient(0, 0, 0, 0, 0, 1);
  radial.addColorStop(0.23, "black");
  radial.addColorStop(0.72, "transparent");
  layerContext.globalCompositeOperation = "destination-in";
  layerContext.fillStyle = radial;
  layerContext.fillRect(-2, -2, 4, 4);
  layerContext.restore();
  layerContext.globalCompositeOperation = "source-over";
  context.drawImage(layer, 0, 0, bounds.width, bounds.height);
  const maskStart = parseFloat(token("--hero-mask-start")) / 100;
  const maskEnd = parseFloat(token("--hero-mask-end")) / 100;
  for (const image of images) {
    const frame = image.closest<HTMLElement>(".studio-hero-face");
    const art = image.parentElement;
    if (!frame || !art) return null;
    const maskBounds = frame.getBoundingClientRect();
    const frameStyle = getComputedStyle(frame);
    const artStyle = getComputedStyle(art);
    layerContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    layerContext.clearRect(0, 0, bounds.width, bounds.height);
    drawWaterSceneImage(layerContext, image, bounds, {
      filter: artStyle.filter,
      mirror: frame.classList.contains("studio-hero-face-right"),
    });
    const mask = layerContext.createLinearGradient(
      0,
      maskBounds.top - bounds.top,
      0,
      maskBounds.bottom - bounds.top,
    );
    mask.addColorStop(maskStart, "transparent");
    mask.addColorStop(maskEnd, "black");
    layerContext.globalCompositeOperation = "destination-in";
    layerContext.fillStyle = mask;
    layerContext.fillRect(0, 0, bounds.width, bounds.height);
    layerContext.globalCompositeOperation = "source-over";
    context.globalAlpha =
      Number(frameStyle.opacity) *
      (art === frame ? 1 : Number(artStyle.opacity));
    context.drawImage(layer, 0, 0, bounds.width, bounds.height);
  }
  context.globalAlpha = 1;
  return canvas;
}

export function HeroWaterBackground({ children }: { children: ReactNode }) {
  return (
    <WaterBackground
      className="studio-hero-background pointer-events-none absolute inset-0 -z-1 overflow-clip rounded-[inherit]"
      paintScene={paintHeroScene}
    >
      {children}
    </WaterBackground>
  );
}
