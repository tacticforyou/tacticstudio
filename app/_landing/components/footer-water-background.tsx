"use client";

import type { ReactNode } from "react";
import { WaterBackground } from "./water-background";
import { createWaterScene, drawWaterSceneImage } from "./water-scene";

const glowStops = [0, 0.19, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

function paintFooterScene(background: HTMLDivElement) {
  const scene = createWaterScene(background);
  if (!scene) return null;
  const { canvas, context, bounds, images } = scene;
  // Resolve calc(), inherited units, and color-mix() through the CSS engine,
  // keeping the DOM background and the texture on the same design tokens.
  const probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;height:0;visibility:hidden;pointer-events:none";
  probe.setAttribute("aria-hidden", "true");
  background.append(probe);
  try {
    const length = (property: string) => {
      probe.style.width = `var(${property})`;
      return probe.getBoundingClientRect().width;
    };
    const centerX = length("--studio-glow-center-x");
    const centerY = length("--studio-glow-center-y");
    const radiusX = length("--studio-glow-radius-x");
    const radiusY = length("--studio-glow-radius-y");
    context.save();
    context.translate(centerX, centerY);
    context.scale(radiusX, radiusY);
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
    glowStops.forEach((stop, index) => {
      probe.style.color = `var(--studio-glow-color-${index})`;
      gradient.addColorStop(stop, getComputedStyle(probe).color);
    });
    context.fillStyle = gradient;
    context.fillRect(
      -centerX / radiusX,
      -centerY / radiusY,
      bounds.width / radiusX,
      bounds.height / radiusY,
    );
    context.restore();
  } finally {
    probe.remove();
  }
  for (const image of images) {
    const frame = image.closest<HTMLElement>(".studio-footer-face");
    if (!frame) return null;
    const style = getComputedStyle(frame);
    drawWaterSceneImage(context, image, bounds, {
      opacity: Number(style.opacity),
      filter: style.filter,
    });
  }
  return canvas;
}

export function FooterWaterBackground({ children }: { children: ReactNode }) {
  return (
    <WaterBackground
      className="studio-footer-background"
      paintScene={paintFooterScene}
    >
      {children}
    </WaterBackground>
  );
}
