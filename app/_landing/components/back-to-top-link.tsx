"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const dwellDuration = 2200;
const dwellAnimationId = "studio-back-to-top-dwell";

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
  const [dwelling, setDwelling] = useState(false);
  const progress = useRef<SVGCircleElement>(null);
  const dwell = useRef<Animation | null>(null);

  const cancelDwell = useCallback(() => {
    const current = dwell.current;
    dwell.current = null;
    current?.cancel();
    setDwelling(false);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancelDwell();
      },
      { signal },
    );
    window.addEventListener("blur", cancelDwell, { signal });
    window.addEventListener("pagehide", cancelDwell, { signal });
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") cancelDwell();
      },
      { signal },
    );

    return () => {
      controller.abort();
      const current = dwell.current;
      dwell.current = null;
      current?.cancel();
    };
  }, [cancelDwell]);

  function startDwell(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || document.hidden) return;
    const circle = progress.current;
    if (!circle) return;

    cancelDwell();
    const link = event.currentTarget;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const current = circle.animate(
      [{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }],
      {
        id: dwellAnimationId,
        duration: dwellDuration,
        easing: reduced ? "steps(3, end)" : "linear",
        fill: "forwards",
      },
    );
    dwell.current = current;
    setDwelling(true);

    void current.finished.then(
      () => {
        if (dwell.current !== current) return;
        const activate =
          link.isConnected && link.matches(":hover") && !document.hidden;
        cancelDwell();
        if (activate) link.click();
      },
      () => {},
    );
  }

  return (
    <a
      href="#top"
      className="studio-back-to-top"
      aria-label="بازگشت به بالای صفحه"
      data-click-sound="back-to-top"
      data-dwelling={dwelling}
      onPointerEnter={startDwell}
      onPointerLeave={cancelDwell}
      onPointerCancel={cancelDwell}
      onPointerDown={cancelDwell}
      onBlur={cancelDwell}
      onClick={(event) => {
        cancelDwell();
        playFeedback(event);
      }}
    >
      {children}
      <svg
        className="studio-back-to-top-gauge"
        viewBox="0 0 100 100"
        width="100"
        height="100"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="studio-back-to-top-gauge-progress"
          ref={progress}
          cx="50"
          cy="50"
          r="47.5"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </svg>
    </a>
  );
}
