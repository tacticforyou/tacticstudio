"use client";

import { useEffect, useState } from "react";

const years = 13;
const number = new Intl.NumberFormat("fa-IR");

export function ExperienceCount() {
  const [progress, setProgress] = useState(0);
  const count = Math.floor(years * (1 - (1 - progress) ** 2));

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let start: number | undefined;
    let frame = requestAnimationFrame(tick);

    function tick(now: number) {
      start ??= now;
      const progress = reducedMotion.matches
        ? 1
        : Math.min((now - start) / 1000, 1);
      setProgress(progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="inline-grid">
      <span className="invisible col-start-1 row-start-1 motion-reduce:visible [@media(scripting:none)]:visible">
        {number.format(years)}
      </span>
      <span
        className="col-start-1 row-start-1 justify-self-start motion-reduce:hidden [@media(scripting:none)]:hidden"
        style={{ opacity: progress }}
      >
        {number.format(count)}
      </span>
    </span>
  );
}
