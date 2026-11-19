"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const reducedMotion = "(prefers-reduced-motion: reduce)";
const neutralRotation = "rotate3d(1, 0, 0, 0deg)";

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

function badgeTilt(
  { left, top, width, height }: DOMRect,
  clientX: number,
  clientY: number,
  intensity = 1,
) {
  const x = Math.min(1, Math.max(-1, ((clientX - left) / width) * 2 - 1));
  const y = Math.min(1, Math.max(-1, ((clientY - top) / height) * 2 - 1));

  // The side corners sit on a slanted line. Keep their response neutral.
  const pressure = y - 0.46 * x;
  const blend = Math.min(1, Math.max(0, (Math.abs(pressure) - 0.18) / 0.62));
  const edgeInfluence = blend ** 2 * (3 - 2 * blend);
  const edgeBoost = pressure < 0 ? 0.4 : -0.25;
  const strength = 1 + edgeBoost * edgeInfluence;
  const angle = 6.8 * Math.min(Math.hypot(x, y), 1) * strength * intensity;

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
  const brightness = 1 + Math.min(0.05, Math.max(-0.055, facingLight * 0.28));

  return {
    rotation: angle
      ? `rotate3d(${axisX}, ${axisY}, 0, ${angle}deg)`
      : neutralRotation,
    lighting: `brightness(${brightness})`,
  };
}

export function HeroBrandCard({
  children,
  badge,
}: {
  children: ReactNode;
  badge: ReactNode;
}) {
  const pose = useRef<HTMLSpanElement>(null);
  const impact = useRef<HTMLSpanElement>(null);
  const surface = useRef<HTMLSpanElement>(null);
  const motion = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const pressAnimations = useRef<Animation[]>([]);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
      pressAnimations.current.forEach((animation) => animation.cancel());
    },
    [],
  );

  function tilt({
    pointerType,
    clientX,
    clientY,
  }: PointerEvent<HTMLButtonElement>) {
    if (pointerType !== "mouse" || window.matchMedia(reducedMotion).matches)
      return;

    const badgePose = pose.current;
    const badgeSurface = surface.current;
    const badgeMotion = motion.current;
    if (!badgePose || !badgeSurface || !badgeMotion) return;

    if (!badgeMotion.dataset.tilting) badgeMotion.dataset.tilting = "true";
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      // Measure the resting surface so the tilted badge can't move its own pivot.
      const { rotation, lighting } = badgeTilt(
        badgeSurface.getBoundingClientRect(),
        clientX,
        clientY,
      );
      badgePose.style.setProperty("--brand-badge-pose", rotation);
      badgePose.style.setProperty("--brand-badge-lighting", lighting);
    });
  }

  function settle() {
    cancelAnimationFrame(frame.current);
    if (motion.current) delete motion.current.dataset.tilting;
    pose.current?.style.removeProperty("--brand-badge-pose");
    pose.current?.style.removeProperty("--brand-badge-lighting");
  }

  function dip({ detail, clientX, clientY }: MouseEvent<HTMLButtonElement>) {
    const badgeImpact = impact.current;
    const badgeSurface = surface.current;
    const badgeMotion = motion.current;
    const badgeArtwork = badgeImpact?.querySelector("img")?.parentElement;
    if (
      !badgeImpact ||
      !badgeSurface ||
      !badgeMotion ||
      !badgeArtwork ||
      window.matchMedia(reducedMotion).matches
    )
      return;

    const bounds = badgeSurface.getBoundingClientRect();
    const { rotation, lighting } = badgeTilt(
      bounds,
      detail ? clientX : bounds.left + bounds.width * 0.33,
      detail ? clientY : bounds.top + bounds.height * 0.7,
      0.85,
    );
    // These are press deltas only. The outer hover pose keeps following the
    // pointer, including when it leaves or moves while the badge resurfaces.
    const { transform, translate } = getComputedStyle(badgeImpact);
    const { filter } = getComputedStyle(badgeArtwork);
    const animation = { duration: 1600 };
    pressAnimations.current.forEach((running) => running.cancel());
    badgeMotion.dataset.pressing = "true";

    const bob = badgeImpact.animate(
      [
        { transform, translate, easing: "ease-out" },
        {
          transform: rotation,
          translate: "0 2px -12px",
          offset: 0.12,
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        },
        {
          transform: neutralRotation,
          translate: "0 0 0",
        },
      ],
      animation,
    );
    const light = badgeArtwork.animate(
      [
        { filter },
        {
          filter: lighting,
          offset: 0.12,
          easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        },
        { filter: "brightness(1)" },
      ],
      animation,
    );
    pressAnimations.current = [bob, light];
    bob.onfinish = () => {
      if (pressAnimations.current[0] !== bob) return;
      pressAnimations.current = [];
      delete badgeMotion.dataset.pressing;
    };
  }

  return (
    <article className="studio-hero-card studio-hero-brand">
      {children}
      <span
        ref={motion}
        className="studio-hero-brand-art studio-hero-brand-motion"
        style={badgeCamera}
      >
        <span
          ref={pose}
          className="studio-hero-brand-pose absolute inset-0"
          aria-hidden="true"
        >
          <span
            ref={impact}
            className="studio-hero-brand-impact absolute inset-0"
          >
            <span className="studio-hero-brand-face absolute inset-0">
              {badge}
            </span>
          </span>
        </span>
        <span ref={surface} className="studio-hero-brand-surface absolute">
          <button
            type="button"
            aria-label="تکان دادن نشان تاکتیک"
            className="studio-hero-brand-trigger absolute cursor-pointer rounded-full"
            onPointerMove={tilt}
            onPointerLeave={settle}
            onPointerCancel={settle}
            onClick={dip}
          />
        </span>
      </span>
    </article>
  );
}
