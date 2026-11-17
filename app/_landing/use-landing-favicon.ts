import { type RefObject, useEffect, useRef, useState } from "react";

const white = [255, 255, 255];
const footerAccent = "#CDCFC0";
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

export function useLandingFavicon(
  section: RefObject<HTMLElement | null>,
  accent: string,
) {
  const [region, setRegion] = useState<"portfolio" | "footer" | undefined>();
  const favicon = useRef<Awaited<ReturnType<typeof loadFavicon>>>(undefined);
  const activeAccent =
    region === "footer"
      ? footerAccent
      : region === "portfolio"
        ? accent
        : undefined;

  useEffect(() => {
    const portfolio = section.current;
    const footer = document.getElementById("contact");
    if (!portfolio) return;

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) intersecting.add(target);
        else intersecting.delete(target);
      }
      if (footer && intersecting.has(footer)) setRegion("footer");
      else setRegion(intersecting.has(portfolio) ? "portfolio" : undefined);
    });
    observer.observe(portfolio);
    if (footer) observer.observe(footer);
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
    if (!activeAccent && !favicon.current) return;

    const controller = new AbortController();
    let frame = 0;

    async function fade() {
      const icon = favicon.current ?? (await loadFavicon(controller.signal));
      if (!icon || controller.signal.aborted) return;
      favicon.current = icon;

      const from = icon.color;
      const to = activeAccent
        ? [1, 3, 5].map((offset) =>
            parseInt(activeAccent.slice(offset, offset + 2), 16),
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

          if (!activeAccent && step === steps) {
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
  }, [activeAccent]);
}
