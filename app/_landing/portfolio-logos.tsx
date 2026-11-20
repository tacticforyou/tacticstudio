"use client";

import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  MotionConfig,
} from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties } from "react";
import { Art } from "./components/art";

export type PortfolioLogo = {
  asset: string;
  width: number;
  height: number;
  // Right edge of the symbol in the original SVG, before the wordmark begins.
  symbolWidth: number;
};

const offsets = [-2, -1, 0, 1, 2];
const edgeVariants = {
  enter: (direction: number) => ({
    x: `${direction * 300 - 50}%`,
    scale: 0.8,
    opacity: 0,
  }),
  exit: (direction: number) => ({
    x: `${direction * -300 - 50}%`,
    scale: 0.8,
    opacity: 0,
  }),
};

export function PortfolioLogos({
  projects,
  active,
  direction,
}: {
  projects: readonly { name: string; logo: PortfolioLogo }[];
  active: number;
  direction: number;
}) {
  const maxLogoAspect = Math.max(
    ...projects.map(({ logo }) => logo.width / logo.height),
  );

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <ul
          aria-label="لوگوهای پروژه ها"
          className="studio-project-logos relative mx-auto mt-[calc(94*var(--u))] h-[calc(70*var(--u))] w-full overflow-hidden studio-mobile:mt-8 studio-mobile:h-12 studio-compact:h-10"
          dir="ltr"
          style={
            { "--project-logo-max-aspect": maxLogoAspect } as CSSProperties
          }
        >
          <AnimatePresence initial={false} custom={direction}>
            {offsets.map((offset) => {
              const index =
                (active + offset + projects.length) % projects.length;
              const project = projects[index];
              const isActive = offset === 0;

              return (
                <m.li
                  key={project.name}
                  aria-current={isActive ? "true" : undefined}
                  className="absolute top-0 left-1/2 flex h-full w-1/5 items-center justify-center px-[min(1rem,1vw)] studio-mobile:w-1/3"
                  initial="enter"
                  animate={{
                    x: `${offset * 100 - 50}%`,
                    scale: isActive ? 1.2 : 0.8,
                    opacity: isActive ? 1 : 0.66,
                  }}
                  exit="exit"
                  custom={direction}
                  variants={edgeVariants}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <span
                    className="studio-project-logo"
                    data-active={isActive}
                    style={
                      {
                        "--project-logo-aspect":
                          project.logo.width / project.logo.height,
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
            })}
          </AnimatePresence>
        </ul>
      </LazyMotion>
    </MotionConfig>
  );
}
