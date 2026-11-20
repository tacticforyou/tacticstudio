"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type WaterPoint = { x: number; y: number };

const simulationStep = 1000 / 60;
const refractionScale = 28;

export function WaterBackground({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGFEImageElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const filterId = useId();

  useEffect(() => {
    const background = backgroundRef.current;
    const map = mapRef.current;
    const displacement = displacementRef.current;
    // Mount directly inside the section that should receive pointer movements.
    const section = background?.parentElement;
    if (!background || !map || !displacement || !section) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let current = new Float32Array(0);
    let previous = new Float32Array(0);
    let damping = new Float32Array(0);
    let edgeFade = new Float32Array(0);
    let pixels: ImageData;
    let frame = 0;
    let lastFrame = 0;
    let accumulatedTime = 0;
    let strength = 0;
    let restingTime = 0;
    let target: WaterPoint | null = null;
    let lastPoint: WaterPoint | null = null;
    let visible = true;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      accumulatedTime = 0;
      strength = 0;
      restingTime = 0;
      current.fill(0);
      previous.fill(0);
      background!.style.removeProperty("filter");
      map!.removeAttribute("href");
      displacement!.setAttribute("scale", "0");
    }

    function clear() {
      stop();
      target = null;
      lastPoint = null;
    }

    function resize() {
      clear();
      const bounds = background!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // Square simulation cells keep the waves circular at every section aspect ratio.
      width = Math.min(192, Math.max(64, Math.round(bounds.width / 6)));
      height = Math.max(2, Math.round((width * bounds.height) / bounds.width));
      canvas.width = width;
      canvas.height = height;
      current = new Float32Array(width * height);
      previous = new Float32Array(width * height);
      damping = new Float32Array(width * height);
      edgeFade = new Float32Array(width * height);
      pixels = context!.createImageData(width, height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = 128;
        pixels.data[i + 1] = 128;
        pixels.data[i + 3] = 255;
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const edge = Math.min(x, y, width - 1 - x, height - 1 - y);
          const t = Math.min(1, edge / 8);
          const fade = t * t * (3 - 2 * t);
          const i = y * width + x;
          // Absorb the wake at the perimeter instead of reflecting sharp rings.
          damping[i] = 0.86 + 0.123 * fade;
          edgeFade[i] = fade;
        }
      }
    }

    function step() {
      // Damped wave equation: each point transfers its height to its neighbours.
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          previous[i] =
            ((current[i - 1] +
              current[i + 1] +
              current[i - width] +
              current[i + width]) /
              2 -
              previous[i]) *
            damping[i];
        }
      }
      [current, previous] = [previous, current];
    }

    function paint(now: number) {
      frame = 0;
      const delta = lastFrame ? Math.min(now - lastFrame, 50) : simulationStep;
      lastFrame = now;
      accumulatedTime += delta;
      let steps = 0;
      // Keep propagation and pointer input consistent across display refresh rates.
      while (accumulatedTime >= simulationStep) {
        followPointer();
        step();
        accumulatedTime -= simulationStep;
        steps++;
      }
      // Higher-refresh displays do not need duplicate displacement images.
      if (!steps) {
        frame = requestAnimationFrame(paint);
        return;
      }
      const elapsed = steps * simulationStep;

      let energy = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          const dx = current[i - 1] - current[i + 1];
          const dy = current[i - width] - current[i + width];
          energy = Math.max(energy, Math.abs(dx), Math.abs(dy));
          const fade = edgeFade[i];
          // A soft limit avoids hard creases when several waves overlap.
          pixels.data[i * 4] = 128 + 110 * Math.tanh(dx * 1.6) * fade;
          pixels.data[i * 4 + 1] = 128 + 110 * Math.tanh(dy * 1.6) * fade;
        }
      }

      const following =
        target &&
        lastPoint &&
        Math.hypot(target.x - lastPoint.x, target.y - lastPoint.y) > 0.01;
      restingTime = following ? 0 : restingTime + elapsed;
      if (
        !following &&
        (energy < 0.001 || (restingTime >= 1800 && strength < 0.001))
      ) {
        stop();
        return;
      }

      const t = Math.min(1, restingTime / 1800);
      const tail = 1 - t * t * (3 - 2 * t);
      const envelope = Math.min(1, energy / 0.035) * tail;
      strength += (envelope - strength) * (1 - Math.exp(-elapsed / 110));
      context!.putImageData(pixels, 0, 0);
      map!.setAttribute("href", canvas.toDataURL());
      displacement!.setAttribute("scale", String(refractionScale * strength));
      background!.style.filter = `url(#${filterId})`;
      frame = requestAnimationFrame(paint);
    }

    function disturb(x: number, y: number, strength: number) {
      const radius = 5;
      for (let oy = -radius; oy <= radius; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          const px = Math.round(x) + ox;
          const py = Math.round(y) + oy;
          if (px < 1 || px >= width - 1 || py < 1 || py >= height - 1) continue;
          const dx = px - x;
          const dy = py - y;
          const weight = Math.exp(-(dx * dx + dy * dy) / 8);
          const i = py * width + px;
          current[i] += weight * strength;
        }
      }
    }

    function followPointer() {
      if (!target || !lastPoint) return;
      const dx = target.x - lastPoint.x;
      const dy = target.y - lastPoint.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.01) {
        lastPoint = target;
        return;
      }
      // A short follow-through rounds off sudden direction changes.
      const travel = Math.min(
        10,
        distance * (1 - Math.exp(-simulationStep / 42)),
      );
      const next = {
        x: lastPoint.x + (dx / distance) * travel,
        y: lastPoint.y + (dy / distance) * travel,
      };
      const count = Math.max(1, Math.ceil(travel));
      for (let i = 1; i <= count; i++) {
        const t = i / count;
        disturb(
          lastPoint.x + (next.x - lastPoint.x) * t,
          lastPoint.y + (next.y - lastPoint.y) * t,
          (Math.min(travel, 4) * 0.07) / count,
        );
      }
      lastPoint = next;
    }

    function move(event: PointerEvent) {
      if (
        event.pointerType !== "mouse" ||
        motion.matches ||
        !pointer.matches ||
        !visible ||
        document.hidden ||
        !width
      )
        return;

      const bounds = background!.getBoundingClientRect();
      target = {
        x: ((event.clientX - bounds.left) / bounds.width) * (width - 1),
        y: ((event.clientY - bounds.top) / bounds.height) * (height - 1),
      };
      if (!lastPoint) lastPoint = target;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function leave() {
      target = null;
      lastPoint = null;
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clear();
    });
    resizeObserver.observe(background);
    intersection.observe(section);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    section.addEventListener("pointercancel", leave);
    motion.addEventListener("change", clear);
    pointer.addEventListener("change", clear);
    document.addEventListener("visibilitychange", clear);

    return () => {
      clear();
      resizeObserver.disconnect();
      intersection.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("pointercancel", leave);
      motion.removeEventListener("change", clear);
      pointer.removeEventListener("change", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [filterId]);

  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute size-0"
      >
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={mapRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="water"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="water"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div ref={backgroundRef} className={className} aria-hidden="true">
        {children}
      </div>
    </>
  );
}
