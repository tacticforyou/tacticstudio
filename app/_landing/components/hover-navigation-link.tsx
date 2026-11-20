"use client";

import type { ReactNode } from "react";
import { useHoverActivation } from "./use-hover-activation";

export function HoverNavigationLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const hover = useHoverActivation(".studio-nav-progress", "scale", "1 1");

  return (
    <a href={href} className={className} {...hover}>
      <span className="studio-nav-label studio-dwell-nav-label">
        {children}
        <span className="studio-nav-progress" aria-hidden="true" />
      </span>
    </a>
  );
}
