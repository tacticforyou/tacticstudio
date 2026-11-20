"use client";

import type { ReactNode } from "react";
import { animatePress } from "../press-animation";
import { useHoverActivation } from "./use-hover-activation";

export function AnimatedActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const hover = useHoverActivation(
    ".studio-button-glint",
    "transform",
    "translate(50%, 43%) scale(1.025, 0.9)",
  );

  return (
    <a
      href={href}
      className={className}
      {...hover}
      onClick={(event) => {
        hover.onClick();
        animatePress(event.currentTarget);
      }}
    >
      {children}
    </a>
  );
}
