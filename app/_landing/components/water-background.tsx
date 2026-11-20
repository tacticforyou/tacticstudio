"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type WaterPoint = { x: number; y: number };

const simulationStep = 1000 / 60;
const rippleIntensity = 0.8;
const refractionScale = 28 * rippleIntensity;
const waterLight = { x: -0.5, y: -0.5, z: Math.SQRT1_2 };
const highlightOpacity = 0.22 * rippleIntensity;
const shadowOpacity = 0.17 * rippleIntensity;
const neutralLight = 128 / 255;

function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

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
    let cellSize = 1;
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
    let motionOrigin: WaterPoint | null = null;
    let visible = true;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastFrame = 0;
      accumulatedTime = 0;
      strength = 0;
      restingTime = 0;
      motionOrigin = null;
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
      cellSize = bounds.width / (width - 1);
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
        pixels.data[i + 2] = 128;
        pixels.data[i + 3] = 255;
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const edge = Math.min(x, y, width - 1 - x, height - 1 - y);
          const fade = smoothstep(edge / 8);
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
          // Use the spare blue channel for light from the upper left at 45 degrees.
          const nx = dx * 0.9;
          const ny = dy * 0.9;
          const normalLength = Math.sqrt(1 + nx * nx + ny * ny);
          const diffuse =
            (nx * waterLight.x + ny * waterLight.y + waterLight.z) /
              normalLength -
            waterLight.z;
          const heightLight = 0.2 * Math.tanh(current[i] * 0.7);
          const light = Math.tanh(diffuse * 2 + heightLight);
          pixels.data[i * 4 + 2] = 128 + 110 * light * fade * strength;
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

      const tail = 1 - smoothstep(restingTime / 1800);
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
      const origin = motionOrigin ?? lastPoint;
      const originEase = 1 - Math.exp(-simulationStep / 180);
      motionOrigin = {
        x: origin.x + (lastPoint.x - origin.x) * originEase,
        y: origin.y + (lastPoint.y - origin.y) * originEase,
      };
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
      // Measure CSS pixels per millisecond and excursion from a slowly following origin.
      // Short, rapid wiggles stay gentle; fast, broad sweeps reach the existing ceiling.
      const speed = (travel * cellSize) / simulationStep;
      const range =
        Math.hypot(next.x - motionOrigin.x, next.y - motionOrigin.y) * cellSize;
      const speedResponse = smoothstep(speed / 1.25);
      const motionGain =
        0.04 + 0.96 * speedResponse * speedResponse * smoothstep(range / 64);
      const count = Math.max(1, Math.ceil(travel));
      for (let i = 1; i <= count; i++) {
        const t = i / count;
        disturb(
          lastPoint.x + (next.x - lastPoint.x) * t,
          lastPoint.y + (next.y - lastPoint.y) * t,
          (Math.min(travel, 4) * 0.07 * motionGain) / count,
        );
      }
      lastPoint = next;
    }

    function pointerPoint(event: PointerEvent): WaterPoint | undefined {
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
      return {
        x: ((event.clientX - bounds.left) / bounds.width) * (width - 1),
        y: ((event.clientY - bounds.top) / bounds.height) * (height - 1),
      };
    }

    function move(event: PointerEvent) {
      const point = pointerPoint(event);
      if (!point) return;
      target = point;
      if (!lastPoint) lastPoint = target;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function press(event: PointerEvent) {
      if (event.button !== 0) return;
      const point = pointerPoint(event);
      if (!point) return;
      disturb(point.x, point.y, 0.4);
      restingTime = 0;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function leave() {
      target = null;
      lastPoint = null;
      motionOrigin = null;
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clear();
    });
    resizeObserver.observe(background);
    intersection.observe(section);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerdown", press, { passive: true });
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
      section.removeEventListener("pointerdown", press);
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
              result="refracted"
            />
            <feColorMatrix
              in="water"
              type="matrix"
              values={`0 0 0 0 0
                       0 0 0 0 0
                       0 0 0 0 0
                       0 0 ${-shadowOpacity} 0 ${shadowOpacity * neutralLight}`}
              result="wave-shadow"
            />
            <feComposite
              in="wave-shadow"
              in2="refracted"
              operator="atop"
              result="shaded"
            />
            <feColorMatrix
              in="water"
              type="matrix"
              values={`0 0 0 0 1
                       0 0 0 0 1
                       0 0 0 0 1
                       0 0 ${highlightOpacity} 0 ${-highlightOpacity * neutralLight}`}
              result="wave-highlight"
            />
            <feComposite in="wave-highlight" in2="shaded" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div ref={backgroundRef} className={className} aria-hidden="true">
        {children}
      </div>
    </>
  );
}
