"use client";

import Image from "next/image";
import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { Art } from "./components/art";
import { LogoRow } from "./components/logo-row";
import { usePortfolioFavicon } from "./use-portfolio-favicon";

type Project = {
  name: string;
  image: {
    src: string;
    width: number;
    height: number;
    // Outer card edges in source pixels. Artwork can extend beyond this frame.
    cardBounds: readonly [
      left: number,
      top: number,
      right: number,
      bottom: number,
    ];
  };
  alt: string;
  color: string;
};

export function PortfolioCarousel({
  projects,
  heading,
  wave,
}: {
  projects: readonly [Project, ...Project[]];
  heading: ReactNode;
  wave: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const project = projects[active];
  usePortfolioFavicon(section, project.color);

  function select(offset: number) {
    setActive(
      (current) => (current + offset + projects.length) % projects.length,
    );
  }

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby="work-title"
      className="studio-band studio-portfolio overflow-hidden pt-[calc(25*var(--u))] pb-[calc(114*var(--u))] studio-mobile:pt-10 studio-mobile:pb-12"
    >
      {projects.slice(1).map(({ name, color }, index) => (
        <div
          key={name}
          aria-hidden="true"
          className="studio-project-gradient pointer-events-none absolute inset-0 opacity-0 data-[active=true]:opacity-100 motion-safe:transition-opacity motion-safe:duration-300"
          data-active={active === index + 1}
          style={{ "--project-color": color } as CSSProperties}
        />
      ))}
      <div className="studio-shell relative">
        {heading}
        <div className="mt-[calc(38*var(--u))] grid grid-cols-[minmax(0,1fr)_minmax(0,calc(694*var(--u)))_minmax(0,1fr)] place-items-center gap-4 studio-mobile:grid-cols-[minmax(0,1fr)_minmax(0,7fr)_minmax(0,1fr)] studio-mobile:gap-[0.45rem]">
          <button
            type="button"
            aria-label="پروژه بعدی"
            className="studio-project-arrow cursor-pointer justify-self-start"
            data-direction="right"
            onClick={() => select(1)}
          >
            <Art name="icon-arrow-right.svg" sizes="138px" />
          </button>
          <div className="grid w-full grid-cols-1 items-center">
            {projects.map(({ name, image, alt }, index) => {
              const [left, top, right, bottom] = image.cardBounds;
              const cardWidth = right - left;
              const cardHeight = bottom - top;

              return (
                <figure
                  key={name}
                  aria-hidden={active !== index}
                  data-active={active === index}
                  className="relative col-start-1 row-start-1 w-full opacity-0 data-[active=true]:opacity-100 motion-safe:transition-opacity motion-safe:duration-300"
                  style={{ aspectRatio: `${cardWidth} / ${cardHeight}` }}
                >
                  <Image
                    src={image.src}
                    alt={alt}
                    width={image.width}
                    height={image.height}
                    className="pointer-events-none absolute h-auto max-w-none"
                    style={{
                      width: `${(100 * image.width) / cardWidth}%`,
                      left: `${(-100 * left) / cardWidth}%`,
                      top: `${(-100 * top) / cardHeight}%`,
                    }}
                    sizes="(max-width: 760px) 74vw, (max-width: 1920px) 39vw, 750px"
                    unoptimized={index === 0}
                  />
                </figure>
              );
            })}
          </div>
          <button
            type="button"
            aria-label="پروژه قبلی"
            className="studio-project-arrow cursor-pointer justify-self-end"
            data-direction="left"
            onClick={() => select(-1)}
          >
            <Art name="icon-arrow-left.svg" sizes="138px" />
          </button>
        </div>
        <output className="sr-only">{project.name}</output>
        <LogoRow featuredProject={project.name} />
      </div>
      {wave}
    </section>
  );
}
