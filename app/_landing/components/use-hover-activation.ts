"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

export function useHoverActivation(
  selector: string,
  property: "scale" | "transform",
  target: string,
) {
  const [active, setActive] = useState(false);
  const dwell = useRef<Animation | null>(null);
  const reset = useRef<Animation | null>(null);
  const listeners = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    setActive(false);
    listeners.current?.abort();
    listeners.current = null;
    const current = dwell.current;
    dwell.current = null;
    if (!current) return;

    const element = (current.effect as KeyframeEffect).target;
    const from = element ? getComputedStyle(element)[property] : null;
    current.cancel();
    if (
      element &&
      from &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      reset.current?.cancel();
      reset.current = element.animate(
        [
          { [property]: from },
          { [property]: getComputedStyle(element)[property] },
        ],
        { duration: 180, easing: "ease-out" },
      );
    }
  }, [property]);

  useEffect(
    () => () => {
      listeners.current?.abort();
      const current = dwell.current;
      dwell.current = null;
      current?.cancel();
      reset.current?.cancel();
    },
    [],
  );

  function start(event: PointerEvent<HTMLAnchorElement>) {
    if (
      event.pointerType !== "mouse" ||
      event.buttons !== 0 ||
      document.hidden ||
      !window.matchMedia("(hover: hover)").matches
    )
      return;

    const link = event.currentTarget;
    const element = link.querySelector<HTMLElement>(selector);
    if (!element) return;
    cancel();
    const from = getComputedStyle(element)[property];
    reset.current?.cancel();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const style = getComputedStyle(link);
    const duration = Number(
      style.getPropertyValue("--studio-hover-duration-ms"),
    );
    const easing = style.getPropertyValue("--studio-hover-easing").trim();
    setActive(true);
    const current = element.animate(
      [{ [property]: from }, { [property]: target }],
      {
        id: "studio-hover-activation",
        duration,
        easing: reduced ? "steps(3, end)" : easing,
        fill: "forwards",
      },
    );
    dwell.current = current;

    const controller = new AbortController();
    listeners.current = controller;
    const { signal } = controller;
    window.addEventListener("blur", cancel, { signal });
    window.addEventListener("pagehide", cancel, { signal });
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) cancel();
      },
      { signal },
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") cancel();
      },
      { signal },
    );

    void current.finished.then(
      () => {
        if (dwell.current !== current) return;
        const activate =
          link.isConnected &&
          link.matches(":hover") &&
          !link.closest("[inert]") &&
          !document.hidden;
        cancel();
        if (activate) link.click();
      },
      () => {},
    );
  }

  return {
    "data-hover-activating": active,
    onPointerEnter: start,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onPointerDown: cancel,
    onBlur: cancel,
    onClick: cancel,
  };
}
