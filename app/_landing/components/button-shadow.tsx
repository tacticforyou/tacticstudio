"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export function ButtonShadow({ tone }: { tone: "sage" | "rose" }) {
  const element = useRef<HTMLSpanElement>(null);
  const [loadedSource, setLoadedSource] = useState<string>();
  const source = `/images/landing/shadow-button-${tone}.png`;
  const ready = loadedSource === source;

  useEffect(() => {
    const target = element.current;
    if (!target) return;
    let disposed = false;

    // Discover this decorative image only after hydration and visibility.
    // decode() resolves after the original texture is ready to paint.
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      const image = new Image();
      image.fetchPriority = "low";
      image.decoding = "async";
      image.src = source;
      image.decode().then(
        () => {
          if (!disposed) setLoadedSource(source);
        },
        () => {
          // A failed decorative asset stays hidden; the link remains usable.
        },
      );
    });
    observer.observe(target);

    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [source]);

  return (
    <span
      ref={element}
      aria-hidden="true"
      className="studio-button-shadow"
      data-ready={ready ? "true" : undefined}
      style={
        ready
          ? ({
              "--studio-button-shadow": `url("${source}")`,
            } as CSSProperties)
          : undefined
      }
    />
  );
}
