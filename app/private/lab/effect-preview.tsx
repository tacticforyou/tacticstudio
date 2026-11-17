"use client";

import { useEffect, useRef } from "react";
import { createEffectRenderer } from "./effect-renderer";

export function EffectPreview({ mode }: { mode: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createEffectRenderer(canvas, mode);
    if (!renderer) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const resting = { x: 0.56, y: 0.48, influence: 0.34 };
    let target = resting;
    let current = resting;
    let frame = 0;
    let lastFrame = 0;

    function paint(now: number) {
      frame = 0;
      const delta = lastFrame ? Math.min(now - lastFrame, 50) : 1000 / 60;
      const ease = 1 - Math.exp(-delta / 94);
      lastFrame = now;
      const moving =
        !reduced.matches &&
        Math.max(
          Math.abs(target.x - current.x),
          Math.abs(target.y - current.y),
          Math.abs(target.influence - current.influence),
        ) > 0.001;
      current = moving
        ? {
            x: current.x + (target.x - current.x) * ease,
            y: current.y + (target.y - current.y) * ease,
            influence:
              current.influence + (target.influence - current.influence) * ease,
          }
        : target;
      renderer!.paint(current);
      if (moving) schedule();
      else lastFrame = 0;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function move(event: PointerEvent) {
      const bounds = canvas!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      target = {
        x: Math.min(
          1,
          Math.max(0, (event.clientX - bounds.left) / bounds.width),
        ),
        y: Math.min(
          1,
          Math.max(0, (event.clientY - bounds.top) / bounds.height),
        ),
        influence: 1,
      };
      schedule();
    }

    function reset() {
      target = resting;
      schedule();
    }

    const resize = new ResizeObserver(schedule);
    resize.observe(canvas);
    canvas.addEventListener("pointermove", move, { passive: true });
    canvas.addEventListener("pointerdown", move, { passive: true });
    canvas.addEventListener("pointerleave", reset);
    canvas.addEventListener("pointercancel", reset);
    reduced.addEventListener("change", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", move);
      canvas.removeEventListener("pointerleave", reset);
      canvas.removeEventListener("pointercancel", reset);
      reduced.removeEventListener("change", schedule);
      renderer.dispose();
    };
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full touch-pan-y"
    />
  );
}
