"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

export function WaterBackground({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGFEImageElement>(null);
  const filterId = useId();

  useEffect(() => {
    const background = backgroundRef.current;
    const map = mapRef.current;
    // Mount directly inside the section that should receive pointer movements.
    const section = background?.parentElement;
    if (!background || !map || !section) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let current = new Float32Array(0);
    let previous = new Float32Array(0);
    let pixels: ImageData;
    let frame = 0;
    let lastFrame = 0;
    let lastPoint: { x: number; y: number } | null = null;
    let visible = true;

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      lastPoint = null;
      current.fill(0);
      previous.fill(0);
      background!.style.removeProperty("filter");
      map!.removeAttribute("href");
    }

    function resize() {
      clear();
      const bounds = background!.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // Square simulation cells keep the waves circular at every section aspect ratio.
      width = Math.min(256, Math.max(64, Math.round(bounds.width / 5)));
      height = Math.max(2, Math.round((width * bounds.height) / bounds.width));
      canvas.width = width;
      canvas.height = height;
      current = new Float32Array(width * height);
      previous = new Float32Array(width * height);
      pixels = context!.createImageData(width, height);
      for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = 128;
        pixels.data[i + 1] = 128;
        pixels.data[i + 3] = 255;
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
            0.975;
        }
      }
      [current, previous] = [previous, current];
    }

    function paint(now: number) {
      frame = 0;
      if (lastFrame && now - lastFrame < 1000 / 30 - 1) {
        frame = requestAnimationFrame(paint);
        return;
      }
      lastFrame = now;
      step();
      step();

      let energy = 0;
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const i = y * width + x;
          const dx = current[i - 1] - current[i + 1];
          const dy = current[i - width] - current[i + width];
          energy = Math.max(
            energy,
            Math.abs(current[i]),
            Math.abs(previous[i]),
          );
          pixels.data[i * 4] = 128 + Math.max(-127, Math.min(127, dx * 150));
          pixels.data[i * 4 + 1] =
            128 + Math.max(-127, Math.min(127, dy * 150));
        }
      }

      if (energy < 0.002) {
        clear();
        return;
      }

      context!.putImageData(pixels, 0, 0);
      map!.setAttribute("href", canvas.toDataURL());
      background!.style.filter = `url(#${filterId})`;
      frame = requestAnimationFrame(paint);
    }

    function disturb(x: number, y: number, strength: number) {
      const radius = 3;
      for (let oy = -radius; oy <= radius; oy++) {
        for (let ox = -radius; ox <= radius; ox++) {
          const px = Math.round(x) + ox;
          const py = Math.round(y) + oy;
          if (px < 1 || px >= width - 1 || py < 1 || py >= height - 1) continue;
          const weight = Math.exp(-(ox * ox + oy * oy) / 3);
          const i = py * width + px;
          current[i] = Math.min(2, current[i] + weight * strength);
        }
      }
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
      const point = {
        x: ((event.clientX - bounds.left) / bounds.width) * (width - 1),
        y: ((event.clientY - bounds.top) / bounds.height) * (height - 1),
      };
      const start = lastPoint ?? point;
      const distance = Math.hypot(point.x - start.x, point.y - start.y);
      // Interpolate quick movements so the finger leaves a continuous wake.
      const count = Math.min(32, Math.max(1, Math.ceil(distance / 2)));
      for (let i = 1; i <= count; i++) {
        const t = i / count;
        disturb(
          start.x + (point.x - start.x) * t,
          start.y + (point.y - start.y) * t,
          0.8,
        );
      }
      lastPoint = point;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function leave() {
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
              in="SourceGraphic"
              in2="water"
              scale="64"
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
