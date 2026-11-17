"use client";

import type { MouseEvent, ReactNode } from "react";

const animation = {
  id: "studio-back-to-top-click",
  duration: 300,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};

function playFeedback(event: MouseEvent<HTMLAnchorElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const link = event.currentTarget;
  const arrow = link.querySelector<HTMLElement>(".studio-art");
  for (const element of [link, arrow]) {
    element
      ?.getAnimations()
      .find(({ id }) => id === animation.id)
      ?.cancel();
  }

  link.animate(
    [{ backgroundColor: "var(--studio-back-to-top-pressed)", offset: 0.3 }],
    animation,
  );
  arrow?.animate([{ translate: "0 -8px", offset: 0.3 }], animation);
}

export function BackToTopLink({ children }: { children: ReactNode }) {
  return (
    <a
      href="#top"
      className="studio-back-to-top"
      aria-label="بازگشت به بالای صفحه"
      data-click-sound="back-to-top"
      onClick={playFeedback}
    >
      {children}
    </a>
  );
}
