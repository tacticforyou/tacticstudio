"use client";

import { useEffect, useId } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

function buttonOutline(progress: number) {
  const radius = 32;
  const bumpRadius = 11.5;

  if (progress <= 0.00001) {
    return "M 0 32 A 32 32 0 1 1 64 32 A 32 32 0 1 1 0 32 Z";
  }

  // The source circles are 64px and 23px; the smaller ends at (32.5, 6.5).
  // Drawing their outer arcs as one path avoids overlapping glass and seams.
  const distance =
    radius -
    bumpRadius +
    (Math.hypot(0.5, 25.5) - radius + bumpRadius) * progress;
  const angle =
    Math.atan2(-25.5, 0.5) - (1 - progress) * ((80 * Math.PI) / 180);
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  const along =
    (radius ** 2 - bumpRadius ** 2 + distance ** 2) / (2 * distance);
  const across = Math.sqrt(Math.max(0, radius ** 2 - along ** 2));
  const firstX = radius + dx * along - dy * across;
  const firstY = radius + dy * along + dx * across;
  const secondX = radius + dx * along + dy * across;
  const secondY = radius + dy * along - dx * across;

  return `M ${firstX} ${firstY} A ${radius} ${radius} 0 1 1 ${secondX} ${secondY} A ${bumpRadius} ${bumpRadius} 0 0 1 ${firstX} ${firstY} Z`;
}

export function QuickAccessButtonArt({
  open,
  projectTheme,
}: {
  open: boolean;
  projectTheme: boolean;
}) {
  const id = useId();
  const progress = useMotionValue(0);
  const outline = useTransform(progress, buttonOutline);
  const fillOpacity = useTransform(
    progress,
    [0, 1],
    projectTheme ? [0.88, 0.96] : [0.4, 0.6],
  );
  const rotation = useTransform(progress, [0, 1], [0, 90]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const playback = animate(progress, open ? 1 : 0, {
      duration: reducedMotion ? 0 : 0.3,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => playback.stop();
  }, [open, progress, reducedMotion]);

  return (
    <>
      <svg
        className="studio-quick-access-body"
        viewBox="0 -5 64 69"
        width="64"
        height="69"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={id + "-edge"}
            x1="0"
            y1="32"
            x2="64"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <clipPath id={id + "-clip"}>
            <motion.path d={outline} />
          </clipPath>
        </defs>
        <motion.path
          className="studio-quick-access-surface"
          d={outline}
          fill="var(--studio-quick-accent)"
          fillOpacity={fillOpacity}
        />
        <motion.path
          d={outline}
          fill="none"
          stroke={`url(#${id}-edge)`}
          strokeWidth="2"
          clipPath={`url(#${id}-clip)`}
        />
      </svg>
      <motion.span
        className="studio-quick-access-icon"
        style={{ rotate: rotation }}
        aria-hidden="true"
      >
        <Image
          src="/images/landing/quick-access-icon.svg"
          alt=""
          width={18}
          height={17}
          sizes="18px"
        />
      </motion.span>
    </>
  );
}
