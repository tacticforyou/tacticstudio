"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { Art } from "./components/art";
import { animatePress } from "./press-animation";

const labels = { right: "پروژه بعدی", left: "پروژه قبلی" };

export function PortfolioArrow({
  direction,
  onSelect,
}: {
  direction: keyof typeof labels;
  onSelect: () => void;
}) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pressAnimation = useRef<Animation | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const button = buttonRef.current;
    if (!anchor || !button) return;

    const pointerMotion = window.matchMedia(
      "(any-hover: hover) and (prefers-reduced-motion: no-preference)",
    );
    const events = new AbortController();
    const { signal } = events;
    let animationFrame = 0;
    let lastFrameTime = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    function requestFrame() {
      if (animationFrame) return;
      lastFrameTime = performance.now();
      animationFrame = requestAnimationFrame(move);
    }

    function move(now: number) {
      if (!button) return;

      const settled = Math.hypot(targetX - x, targetY - y) < 0.09;
      const easing = 1 - Math.exp(-Math.max(0, now - lastFrameTime) / 135);
      x = settled ? targetX : x + (targetX - x) * easing;
      y = settled ? targetY : y + (targetY - y) * easing;
      lastFrameTime = now;
      button.style.translate = x || y ? `${x}px ${y}px` : "";
      animationFrame = settled ? 0 : requestAnimationFrame(move);
    }

    function reset() {
      if (!button) return;
      targetX = 0;
      targetY = 0;
      delete button.dataset.near;
      if (x || y) requestFrame();
    }

    function followPointer(event: PointerEvent) {
      if (
        !anchor ||
        !button ||
        !pointerMotion.matches ||
        event.pointerType !== "mouse"
      )
        return;

      // Measure the resting slot so the translated button cannot pull itself farther.
      const { left, top, width, height } = anchor.getBoundingClientRect();
      const dx = event.clientX - (left + width / 2);
      const dy = event.clientY - (top + height / 2);
      const proximity = 1 - Math.hypot(dx, dy) / (width / 2 + 44);
      if (proximity <= 0) {
        reset();
        return;
      }

      button.dataset.near = "true";
      targetX = dx * proximity * 0.32;
      targetY = dy * proximity * 0.32;
      requestFrame();
    }

    function stopMotion() {
      if (!button) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      x = y = targetX = targetY = 0;
      button.style.translate = "";
      delete button.dataset.near;
      pressAnimation.current?.cancel();
    }

    window.addEventListener("pointermove", followPointer, {
      passive: true,
      signal,
    });
    window.addEventListener("scroll", reset, { passive: true, signal });
    window.addEventListener("blur", reset, { signal });
    document.documentElement.addEventListener("pointerleave", reset, {
      signal,
    });
    pointerMotion.addEventListener("change", stopMotion, { signal });

    return () => {
      events.abort();
      stopMotion();
    };
  }, []);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    pressAnimation.current = animatePress(event.currentTarget);
    onSelect();
  }

  return (
    <div
      ref={anchorRef}
      className={
        "studio-project-arrow-slot aspect-square w-[calc(138*var(--u))] studio-mobile:w-full " +
        (direction === "right" ? "justify-self-start" : "justify-self-end")
      }
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={labels[direction]}
        className="studio-project-arrow relative block size-full cursor-pointer rounded-full"
        data-direction={direction}
        data-click-sound="project"
        onClick={handleClick}
      >
        <Art name={`icon-arrow-${direction}.svg`} sizes="138px" />
      </button>
    </div>
  );
}
