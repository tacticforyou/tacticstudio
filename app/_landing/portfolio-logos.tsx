"use client";

import {
  animate,
  domAnimation,
  LazyMotion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type MotionStyle,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useSyncExternalStore, type CSSProperties } from "react";
import { Art } from "./components/art";

export type PortfolioLogo = {
  asset: string;
  width: number;
  height: number;
  // Right edge of the symbol in the original SVG, before the wordmark begins.
  symbolWidth: number;
};

type LogoProject = { name: string; logo: PortfolioLogo };

const mobileLogoQuery = "(max-width: 760px)";
const phoneLogoQuery = "(width < 600px)";

function subscribeToLogoViewport(onChange: () => void) {
  const queries = [mobileLogoQuery, phoneLogoQuery].map((query) =>
    window.matchMedia(query),
  );
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () =>
    queries.forEach((query) => query.removeEventListener("change", onChange));
}

function getVisibleLogoCount() {
  if (window.matchMedia(phoneLogoQuery).matches) return 1;
  return window.matchMedia(mobileLogoQuery).matches ? 3 : 5;
}

function getServerLogoCount() {
  return 5;
}

function cyclicOffset(index: number, position: number, count: number) {
  const half = count / 2;
  return ((((index - position + half) % count) + count) % count) - half;
}

function PortfolioLogoItem({
  project,
  index,
  count,
  position,
  progress,
  visibleCount,
  onSelect,
  onPrepare,
}: {
  project: LogoProject;
  index: number;
  count: number;
  position: number;
  progress: MotionValue<number>;
  visibleCount: number;
  onSelect: (index: number) => void;
  onPrepare?: (index: number) => void;
}) {
  // Recycle only beyond the visible slots, where the logo has faded out.
  const offset = useTransform(progress, (value) =>
    cyclicOffset(index, value, count),
  );
  const x = useTransform(offset, (value) => `${value * 100 - 50}%`);
  const scale = useTransform(offset, [-1, 0, 1], [0.8, 1.2, 0.8]);
  const half = count / 2;
  const opacity = useTransform(
    offset,
    [-half, -2, -1, 0, 1, 2, half],
    visibleCount === 1
      ? [0, 0, 0, 1, 0, 0, 0]
      : [0, 0.66, 0.66, 1, 0.66, 0.66, 0],
  );
  const targetOffset = cyclicOffset(index, position, count);
  const isActive = targetOffset === 0;
  const isVisible = Math.abs(targetOffset) <= (visibleCount - 1) / 2;

  return (
    <m.li
      aria-hidden={!isVisible}
      inert={!isVisible}
      className="absolute top-0 left-1/2 flex h-full w-1/5 items-center justify-center px-[min(1rem,1vw)] max-[600px]:w-5/6 studio-tablet:studio-mobile:w-1/3"
      style={{ x, scale, "--project-logo-opacity": opacity } as MotionStyle}
    >
      <button
        type="button"
        aria-label={`نمایش پروژه ${project.name}`}
        aria-pressed={isActive}
        onClick={() => onSelect(index)}
        onPointerEnter={() => onPrepare?.(index)}
        onFocus={() => onPrepare?.(index)}
        className="group flex size-full cursor-pointer items-center justify-center rounded-xl focus-visible:-outline-offset-8 focus-visible:outline-studio-focus"
      >
        <span
          className="studio-project-logo group-hover:opacity-100 group-focus-visible:opacity-100"
          data-active={isActive}
          style={
            {
              "--project-logo-aspect": project.logo.width / project.logo.height,
              "--project-logo-symbol-width": `${(100 * project.logo.symbolWidth) / project.logo.width}%`,
              "--project-logo-symbol-offset": `${50 * (1 - project.logo.symbolWidth / project.logo.width)}%`,
            } as CSSProperties
          }
        >
          <Art
            className="absolute inset-0 size-full"
            name={project.logo.asset}
            sizes="(max-width: 760px) 50vw, 280px"
          />
        </span>
      </button>
    </m.li>
  );
}

export function PortfolioLogos({
  projects,
  position,
  onSelect,
  onPrepare,
}: {
  projects: readonly LogoProject[];
  position: number;
  onSelect: (index: number) => void;
  onPrepare?: (index: number) => void;
}) {
  const progress = useMotionValue(position);
  const reduceMotion = useReducedMotion();
  const visibleCount = useSyncExternalStore(
    subscribeToLogoViewport,
    getVisibleLogoCount,
    getServerLogoCount,
  );
  const maxLogoAspect = Math.max(
    ...projects.map(({ logo }) => logo.width / logo.height),
  );

  useEffect(() => {
    const animation = animate(progress, position, {
      duration: reduceMotion ? 0 : 0.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => animation.stop();
  }, [position, progress, reduceMotion]);

  return (
    <LazyMotion features={domAnimation} strict>
      <ul
        aria-label="لوگوهای پروژه ها"
        className="studio-project-logos relative col-span-full mx-auto mt-[calc(94*var(--u))] h-[calc(70*var(--u))] w-full overflow-hidden max-[600px]:col-span-1 max-[600px]:col-start-2 max-[600px]:row-start-2 max-[600px]:mt-0 studio-mobile:h-12 studio-compact:h-10 studio-tablet:studio-mobile:mt-8"
        dir="ltr"
        style={{ "--project-logo-max-aspect": maxLogoAspect } as CSSProperties}
      >
        {projects.map((project, index) => (
          <PortfolioLogoItem
            key={project.name}
            project={project}
            index={index}
            count={projects.length}
            position={position}
            progress={progress}
            visibleCount={visibleCount}
            onSelect={onSelect}
            onPrepare={onPrepare}
          />
        ))}
      </ul>
    </LazyMotion>
  );
}
