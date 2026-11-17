"use client";

import type { ReactNode } from "react";
import { animatePress } from "../press-animation";

export function AnimatedActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        animatePress(event.currentTarget);
      }}
    >
      {children}
    </a>
  );
}
