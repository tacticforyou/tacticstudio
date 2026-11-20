"use client";

import { useInView } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { PortfolioArrow } from "./portfolio-arrow";
import { PortfolioLogos } from "./portfolio-logos";
import { projectFrame, type PortfolioProject } from "./portfolio-project";
import { prepareProjectArtwork, ProjectArtwork } from "./project-artwork";
import { useLandingFavicon } from "./use-landing-favicon";

export function PortfolioCarousel({
  projects,
  heading,
  wave,
}: {
  projects: readonly [PortfolioProject, ...PortfolioProject[]];
  heading: ReactNode;
  wave: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const [{ position, visited }, setNavigation] = useState({
    position: 0,
    visited: [0],
  });
  const requestedPosition = useRef(0);
  const requestVersion = useRef(0);
  const nearby = useInView(section, { margin: "250px 0px", once: true });
  const active =
    ((position % projects.length) + projects.length) % projects.length;
  const project = projects[active];
  const widestFrameAspect = Math.max(
    ...projects.map((item) => {
      const [width, height] = projectFrame(item);
      return width / height;
    }),
  );
  useLandingFavicon(section, project.color);

  useEffect(() => {
    if (!nearby) return;
    for (const offset of [-1, 0, 1]) {
      const index = (active + offset + projects.length) % projects.length;
      void prepareProjectArtwork(projects[index]).catch(() => {});
    }
  }, [active, nearby, projects]);

  useEffect(
    () => () => {
      requestVersion.current += 1;
    },
    [],
  );

  function prepare(index: number) {
    void prepareProjectArtwork(projects[index]).catch(() => {});
  }

  function navigate(next: number) {
    requestedPosition.current = next;
    const version = ++requestVersion.current;
    const index =
      ((next % projects.length) + projects.length) % projects.length;
    void prepareProjectArtwork(projects[index])
      .then(() => {
        if (version !== requestVersion.current) return;
        setNavigation((current) => ({
          position: next,
          visited: current.visited.includes(index)
            ? current.visited
            : [...current.visited, index],
        }));
      })
      .catch((error) => {
        if (version !== requestVersion.current) return;
        requestedPosition.current = position;
        console.error("Unable to load project artwork", error);
      });
  }

  function select(offset: number) {
    navigate(requestedPosition.current + offset);
  }

  function selectProject(index: number) {
    const current = requestedPosition.current;
    const currentIndex =
      ((current % projects.length) + projects.length) % projects.length;
    const distance = (index - currentIndex + projects.length) % projects.length;
    navigate(
      current +
        (distance > projects.length / 2
          ? distance - projects.length
          : distance),
    );
  }

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby="work-title"
      className="studio-band studio-portfolio overflow-visible pt-[calc(25*var(--u))] pb-[calc(114*var(--u))] studio-mobile:pt-10 studio-mobile:pb-12"
    >
      <div
        aria-hidden="true"
        className="studio-project-backdrop pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        {projects.slice(1).map(({ name, color }, index) => (
          <div
            key={name}
            className="studio-project-gradient absolute inset-0 opacity-0 data-[active=true]:opacity-100 motion-safe:transition-opacity motion-safe:duration-300"
            data-active={active === index + 1}
            style={{ "--project-color": color } as CSSProperties}
          />
        ))}
      </div>
      <div className="studio-shell relative">
        {heading}
        <div className="mt-[calc(38*var(--u))] grid grid-cols-[minmax(0,1fr)_minmax(0,calc(694*var(--u)))_minmax(0,1fr)] place-items-center gap-x-4 max-[600px]:grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] max-[600px]:gap-x-2 max-[600px]:gap-y-6 studio-tablet:studio-mobile:grid-cols-[minmax(0,1fr)_minmax(0,7fr)_minmax(0,1fr)] studio-tablet:studio-mobile:gap-x-[0.45rem]">
          <PortfolioArrow
            direction="right"
            onSelect={() => select(1)}
            onPrepare={() => prepare((active + 1) % projects.length)}
          />
          <div
            className="relative w-full max-[600px]:col-span-full max-[600px]:col-start-1 max-[600px]:row-start-1"
            style={{ aspectRatio: widestFrameAspect }}
          >
            {projects.map((item, index) =>
              visited.includes(index) ? (
                <ProjectArtwork
                  key={item.name}
                  project={item}
                  active={active === index}
                  initial={index === 0}
                  widestAspect={widestFrameAspect}
                />
              ) : null,
            )}
          </div>
          <PortfolioArrow
            direction="left"
            onSelect={() => select(-1)}
            onPrepare={() =>
              prepare((active - 1 + projects.length) % projects.length)
            }
          />
          <PortfolioLogos
            projects={projects}
            position={position}
            onSelect={selectProject}
            onPrepare={prepare}
          />
        </div>
        <output className="sr-only">{project.name}</output>
      </div>
      {wave}
    </section>
  );
}
