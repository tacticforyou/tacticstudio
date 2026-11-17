import { type RefObject, useEffect, useRef, useState } from "react";

const white = [255, 255, 255];
const duration = 300;
const steps = 8;

async function loadFavicon(signal: AbortSignal) {
  const link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="icon"][type="image/svg+xml"]',
  );
  if (!link) return;

  const href = link.getAttribute("href")!;
  const response = await fetch(link.href, { signal });
  if (!response.ok) return;

  const svg = new DOMParser().parseFromString(
    await response.text(),
    "image/svg+xml",
  ).documentElement;
  const background = svg.querySelector("#favicon-background");
  if (!background) return;

  return { link, href, svg, background, color: white };
}

export function usePortfolioFavicon(
  section: RefObject<HTMLElement | null>,
  accent: string,
) {
  const [visible, setVisible] = useState(false);
  const favicon = useRef<Awaited<ReturnType<typeof loadFavicon>>>(undefined);

  useEffect(() => {
    if (!section.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.intersectionRatio > 0);
    });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, [section]);

  useEffect(
    () => () => {
      const icon = favicon.current;
      if (icon) icon.link.setAttribute("href", icon.href);
      favicon.current = undefined;
    },
    [],
  );

  useEffect(() => {
    if (!visible && !favicon.current) return;

    const controller = new AbortController();
    let frame = 0;

    async function fade() {
      const icon = favicon.current ?? (await loadFavicon(controller.signal));
      if (!icon || controller.signal.aborted) return;
      favicon.current = icon;

      const from = icon.color;
      const to = visible
        ? [1, 3, 5].map((offset) =>
            parseInt(accent.slice(offset, offset + 2), 16),
          )
        : white;
      if (from.every((value, index) => value === to[index])) return;

      const start = performance.now();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let previous = 0;

      function tick(now: number) {
        if (!icon) return;
        const step = reduced
          ? steps
          : Math.min(steps, Math.floor(((now - start) / duration) * steps));
        if (step !== previous) {
          previous = step;
          icon.color = from.map((value, index) =>
            Math.round(value + ((to[index] - value) * step) / steps),
          );

          if (!visible && step === steps) {
            icon.link.setAttribute("href", icon.href);
          } else {
            icon.background.setAttribute(
              "fill",
              `rgb(${icon.color.join(",")})`,
            );
            icon.link.href = `data:image/svg+xml,${encodeURIComponent(icon.svg.outerHTML)}`;
          }
        }
        if (step < steps) frame = requestAnimationFrame(tick);
      }

      frame = requestAnimationFrame(tick);
    }

    // The default icon stays available if the source cannot be read.
    void fade().catch(() => {});
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
    };
  }, [accent, visible]);
}
