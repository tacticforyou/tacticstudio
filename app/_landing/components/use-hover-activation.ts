"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

function observeCancellation(stop: () => void) {
  const controller = new AbortController();
  const { signal } = controller;
  window.addEventListener("blur", stop, { signal });
  window.addEventListener("pagehide", stop, { signal });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
    },
    { signal },
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") stop();
    },
    { signal },
  );
  return controller;
}

export function useHoverActivation(
  selector: string,
  property: "scale" | "transform" | "translate",
  target: string,
  repeatKey?: number,
) {
  const repeating = repeatKey !== undefined;
  const [active, setActive] = useState(false);
  const dwell = useRef<Animation | null>(null);
  const reset = useRef<Animation | null>(null);
  const listeners = useRef<AbortController | null>(null);
  const hoveredControl = useRef<HTMLAnchorElement | HTMLButtonElement | null>(
    null,
  );

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

  const stop = useCallback(() => {
    hoveredControl.current = null;
    cancel();
  }, [cancel]);

  useEffect(() => {
    if (!repeating) return;
    const controller = observeCancellation(stop);
    return () => controller.abort();
  }, [repeating, stop]);

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

  const begin = useCallback(
    (control: HTMLAnchorElement | HTMLButtonElement, fresh = false) => {
      if (
        document.hidden ||
        !control.isConnected ||
        !control.matches(":hover") ||
        control.matches(":disabled") ||
        control.closest("[inert]")
      )
        return;
      const element = control.querySelector<HTMLElement>(selector);
      if (!element) return;
      cancel();
      let from = getComputedStyle(element)[property];
      reset.current?.cancel();
      if (fresh) from = getComputedStyle(element)[property];
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const style = getComputedStyle(control);
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

      if (!repeating) listeners.current = observeCancellation(stop);

      void current.finished.then(
        () => {
          if (dwell.current !== current) return;
          const activate =
            control.isConnected &&
            control.matches(":hover") &&
            !control.matches(":disabled") &&
            !control.closest("[inert]") &&
            !document.hidden;
          cancel();
          if (activate) control.click();
        },
        () => {},
      );
    },
    [cancel, property, repeating, selector, stop, target],
  );

  useEffect(() => {
    const control = hoveredControl.current;
    if (repeating && control) begin(control, true);
  }, [begin, repeatKey, repeating]);

  function start(event: PointerEvent<HTMLAnchorElement | HTMLButtonElement>) {
    if (
      event.pointerType !== "mouse" ||
      event.buttons !== 0 ||
      document.hidden ||
      !window.matchMedia("(hover: hover)").matches
    )
      return;
    hoveredControl.current = event.currentTarget;
    begin(event.currentTarget);
  }

  return {
    "data-hover-activating": active,
    onPointerEnter: start,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onPointerDown: cancel,
    onBlur: stop,
    onClick: cancel,
  };
}
