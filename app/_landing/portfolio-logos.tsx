"use client";

import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  MotionConfig,
} from "motion/react";
import * as m from "motion/react-m";
import { Art } from "./components/art";

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
  projects: readonly { name: string; logo: string }[];
  active: number;
  direction: number;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <ul
          aria-label="لوگوهای پروژه ها"
          className="relative mx-auto mt-[calc(94*var(--u))] h-[calc(70*var(--u))] w-full overflow-hidden studio-mobile:mt-8 studio-mobile:h-12 studio-compact:h-10"
          dir="ltr"
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
                  <Art
                    className="h-[calc(55*var(--u))] w-full studio-mobile:h-[2.4rem] studio-compact:h-[1.85rem]"
                    name={project.logo}
                    alt={project.name}
                    sizes="(max-width: 760px) 36vw, 280px"
                  />
                </m.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </LazyMotion>
    </MotionConfig>
  );
}
