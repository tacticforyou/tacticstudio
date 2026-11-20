"use client";

import {
  animate,
  domAnimation,
  LazyMotion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import { useEffect, type CSSProperties } from "react";
import { Art } from "./components/art";

export type PortfolioLogo = {
  asset: string;
  width: number;
  height: number;
  // Right edge of the symbol in the original SVG, before the wordmark begins.
  symbolWidth: number;
};

type LogoProject = { name: string; logo: PortfolioLogo };

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
}: {
  project: LogoProject;
  index: number;
  count: number;
  position: number;
  progress: MotionValue<number>;
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
    [0, 0.66, 0.66, 1, 0.66, 0.66, 0],
  );
  const targetOffset = cyclicOffset(index, position, count);
  const isActive = targetOffset === 0;

  return (
    <m.li
      aria-current={isActive ? "true" : undefined}
      aria-hidden={Math.abs(targetOffset) > 2}
      className="absolute top-0 left-1/2 flex h-full w-1/5 items-center justify-center px-[min(1rem,1vw)] studio-mobile:w-1/3"
      style={{ x, scale, opacity }}
    >
      <span
        className="studio-project-logo"
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
          alt={project.name}
          sizes="(max-width: 760px) 50vw, 280px"
        />
      </span>
    </m.li>
  );
}

export function PortfolioLogos({
  projects,
  position,
}: {
  projects: readonly LogoProject[];
  position: number;
}) {
  const progress = useMotionValue(position);
  const reduceMotion = useReducedMotion();
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
        className="studio-project-logos relative mx-auto mt-[calc(94*var(--u))] h-[calc(70*var(--u))] w-full overflow-hidden studio-mobile:mt-8 studio-mobile:h-12 studio-compact:h-10"
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
          />
        ))}
      </ul>
    </LazyMotion>
  );
}
