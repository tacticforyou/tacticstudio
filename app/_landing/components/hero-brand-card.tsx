"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

const pointerMotion =
  "(any-hover: hover) and (prefers-reduced-motion: no-preference)";

const cameraPitch = 42;
const cameraDistance = 550;
const pitchRadians = (cameraPitch * Math.PI) / 180;
const planeYScale = 1 / Math.cos(pitchRadians);
const planePerspective = Math.tan(pitchRadians) / cameraDistance;
const badgeCamera = {
  "--brand-badge-perspective": `${cameraDistance}px`,
  "--brand-badge-camera-pitch": `rotateX(${cameraPitch}deg)`,
  // Undo the resting camera projection because the SVG is already foreshortened.
  "--brand-badge-unproject": `matrix3d(1,0,0,0, 0,${planeYScale},0,${planePerspective}, 0,0,1,0, 0,0,0,1)`,
} as CSSProperties;

export function HeroBrandCard({
  children,
  badge,
}: {
  children: ReactNode;
  badge: ReactNode;
}) {
  const pose = useRef<HTMLSpanElement>(null);
  const surface = useRef<HTMLSpanElement>(null);
  const motion = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function tilt({ pointerType, clientX, clientY }: PointerEvent<HTMLElement>) {
    if (pointerType !== "mouse" || !window.matchMedia(pointerMotion).matches)
      return;

    const badgePose = pose.current;
    const badgeSurface = surface.current;
    const badgeMotion = motion.current;
    if (!badgePose || !badgeSurface || !badgeMotion) return;

    if (!badgeMotion.dataset.tilting) badgeMotion.dataset.tilting = "true";
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      // Measure the resting surface so the tilted badge can't move its own pivot.
      const { left, top, width, height } = badgeSurface.getBoundingClientRect();
      const x = Math.min(1, Math.max(-1, ((clientX - left) / width) * 2 - 1));
      const y = Math.min(1, Math.max(-1, ((clientY - top) / height) * 2 - 1));

      // The side corners sit on a slanted line. Keep their response neutral.
      const pressure = y - 0.46 * x;
      const blend = Math.min(
        1,
        Math.max(0, (Math.abs(pressure) - 0.18) / 0.62),
      );
      const edgeInfluence = blend ** 2 * (3 - 2 * blend);
      const edgeBoost = pressure < 0 ? 0.4 : -0.25;
      const strength = 1 + edgeBoost * edgeInfluence;
      const angle = 8 * Math.min(Math.hypot(x, y), 1) * strength;

      // Rotate about the in-plane axis perpendicular to the pointer direction.
      const dx = x * width;
      const dy = y * height * planeYScale;
      const distance = Math.hypot(dx, dy) || 1;
      const axisX = -dy / distance;
      const axisY = dx / distance;

      // Compare the rotated face normal to a fixed soft light from the lower left.
      const radians = (angle * Math.PI) / 180;
      const facingLight =
        (-0.24 * axisY - 0.8 * axisX) * Math.sin(radians) +
        0.55 * (Math.cos(radians) - 1);
      const brightness =
        1 + Math.min(0.05, Math.max(-0.055, facingLight * 0.28));

      badgePose.style.setProperty(
        "--brand-badge-pose",
        `rotate3d(${axisX}, ${axisY}, 0, ${angle}deg)`,
      );
      badgePose.style.setProperty(
        "--brand-badge-lighting",
        `brightness(${brightness})`,
      );
    });
  }

  function settle() {
    cancelAnimationFrame(frame.current);
    if (motion.current) delete motion.current.dataset.tilting;
    pose.current?.style.removeProperty("--brand-badge-pose");
    pose.current?.style.removeProperty("--brand-badge-lighting");
  }

  return (
    <article
      className="studio-hero-card studio-hero-brand"
      onPointerMove={tilt}
      onPointerLeave={settle}
      onPointerCancel={settle}
    >
      {children}
      <span
        ref={motion}
        className="studio-hero-brand-art studio-hero-brand-motion"
        style={badgeCamera}
        aria-hidden="true"
      >
        <span ref={pose} className="studio-hero-brand-pose absolute inset-0">
          {badge}
        </span>
        <span ref={surface} className="studio-hero-brand-surface absolute" />
      </span>
    </article>
  );
}
