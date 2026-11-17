"use client";

import { useEffect } from "react";

const idleDelay = 1500;
const edgeRange = 48;
const alignmentTolerance = 1;
const scrollKeys = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

export function SectionEdgeAlignment() {
  useEffect(() => {
    const landing = document.querySelector<HTMLElement>(".studio-landing");
    const hero = landing?.querySelector<HTMLElement>(":scope > main > #top");

    if (!landing || !hero) return;

    const sections = Array.from(
      landing.querySelectorAll<HTMLElement>(
        ":scope > main > :is(#top, section), :scope > footer",
      ),
      (section) => ({
        section,
        framed: section.classList.contains("studio-band"),
        wave: section.querySelector(":scope > .studio-wave"),
      }),
    );
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listeners = new AbortController();
    const { signal } = listeners;
    let idleTimer: number | undefined;
    let skipAlignment = false;
    let touchStartY: number | undefined;
    let previousScrollTop = window.scrollY;
    let scrollingDown = true;

    const alignSectionEdge = () => {
      if (reducedMotion.matches || (window.visualViewport?.scale ?? 1) !== 1) {
        return;
      }

      const gutter =
        hero.getBoundingClientRect().left -
        landing.getBoundingClientRect().left;
      const viewportHeight = root.clientHeight;
      const scrollTop = window.scrollY;
      if (scrollTop <= 0 && !scrollingDown) return;

      const maxScroll = root.scrollHeight - viewportHeight;
      const preferredEdge = scrollingDown ? "bottom" : "top";
      let alignment: { delta: number; priority: number } | undefined;

      for (const { section, framed, wave } of sections) {
        const { top, bottom } = section.getBoundingClientRect();
        const bottomGap = viewportHeight - bottom;
        // A plain section starts flush where the preceding band ends.
        const topInset = framed ? gutter : 0;
        const waveEdge = wave?.classList.contains("studio-wave-top")
          ? "top"
          : wave && "bottom";
        const edges = [
          ["top", top, top - topInset],
          ["bottom", bottomGap, gutter - bottomGap],
        ] as const;

        for (const [edge, gap, delta] of edges) {
          if (Math.abs(gap) > edgeRange) continue;
          const destination = scrollTop + delta;
          if (destination < 0 || destination > maxScroll) continue;

          // Keep the visible curve in view when the opposite edge also qualifies.
          const priority =
            (edge === waveEdge ? 0 : 2) + Number(edge !== preferredEdge);
          if (
            !alignment ||
            priority < alignment.priority ||
            (priority === alignment.priority &&
              Math.abs(delta) < Math.abs(alignment.delta))
          ) {
            alignment = { delta, priority };
          }
        }
      }

      if (!alignment || Math.abs(alignment.delta) <= alignmentTolerance) {
        return;
      }

      suppressAlignment();
      window.scrollTo({ top: scrollTop + alignment.delta, behavior: "smooth" });
    };

    function handleScroll() {
      const scrollTop = window.scrollY;
      if (!skipAlignment && scrollTop !== previousScrollTop) {
        scrollingDown = scrollTop > previousScrollTop;
      }
      previousScrollTop = scrollTop;
      scheduleAlignment();
    }

    function scheduleAlignment() {
      window.clearTimeout(idleTimer);
      if (touchStartY !== undefined) return;

      idleTimer = window.setTimeout(() => {
        // Link navigation and the correction itself can both emit scroll events.
        if (skipAlignment) {
          skipAlignment = false;
          return;
        }
        alignSectionEdge();
      }, idleDelay);
    }

    function suppressAlignment() {
      skipAlignment = true;
      scheduleAlignment();
    }

    function resumeManualScrolling() {
      skipAlignment = false;
    }

    function startTouch() {
      touchStartY ??= window.scrollY;
      window.clearTimeout(idleTimer);
    }

    function finishTouch(event: TouchEvent) {
      if (event.touches.length > 0) return;

      const scrolled =
        touchStartY !== undefined && touchStartY !== window.scrollY;
      touchStartY = undefined;
      if (scrolled || skipAlignment) scheduleAlignment();
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      signal,
    });
    window.addEventListener("wheel", resumeManualScrolling, {
      passive: true,
      signal,
    });
    window.addEventListener("touchmove", resumeManualScrolling, {
      passive: true,
      signal,
    });
    window.addEventListener("touchstart", startTouch, {
      passive: true,
      signal,
    });
    window.addEventListener("touchend", finishTouch, { passive: true, signal });
    window.addEventListener("touchcancel", finishTouch, {
      passive: true,
      signal,
    });
    window.addEventListener(
      "keydown",
      (event) => {
        if (scrollKeys.has(event.key)) resumeManualScrolling();
      },
      { signal },
    );
    window.addEventListener(
      "click",
      (event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("a, button")
        ) {
          suppressAlignment();
        }
      },
      { capture: true, signal },
    );
    window.addEventListener("hashchange", suppressAlignment, { signal });
    window.addEventListener("popstate", suppressAlignment, { signal });
    window.addEventListener(
      "pageshow",
      (event) => {
        if (event.persisted) suppressAlignment();
      },
      { signal },
    );

    const [navigation] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    if (window.location.hash || navigation?.type === "back_forward") {
      suppressAlignment();
    } else {
      scheduleAlignment();
    }

    return () => {
      window.clearTimeout(idleTimer);
      listeners.abort();
    };
  }, []);

  return null;
}
