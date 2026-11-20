"use client";

import Image, { getImageProps } from "next/image";
import { domAnimation, LazyMotion, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties, ReactNode } from "react";
import { imageQuality } from "@/lib/image-quality";
import {
  artworkDelays,
  artworkMovement,
  artworkVisibility,
} from "./project-artwork-motion";
import {
  projectFrame,
  type ArtworkBounds,
  type ArtworkLayer,
  type PortfolioProject,
} from "./portfolio-project";

const preparedImages = new Map<string, Promise<void>>();

function layerImage(
  layer: Pick<ArtworkLayer, "src" | "width" | "height" | "bounds">,
  frameWidth: number,
) {
  const fraction = layer.bounds[2] / frameWidth;
  return {
    src: layer.src,
    width: Math.ceil(layer.width),
    height: Math.ceil(layer.height),
    alt: "",
    quality: imageQuality,
    sizes: `(max-width: 599px) ${Math.ceil(fraction * 100)}vw, (max-width: 760px) ${Math.ceil(fraction * 74)}vw, (max-width: 1920px) ${Math.ceil(fraction * 39)}vw, ${Math.ceil(fraction * 750)}px`,
  };
}

function decodeImage(props: { src: string; srcSet?: string; sizes?: string }) {
  const key =
    props.src +
    (props.srcSet ? `:${window.innerWidth}:${window.devicePixelRatio}` : "");
  const existing = preparedImages.get(key);
  if (existing) return existing;
  const image = new window.Image();
  image.decoding = "async";
  if (props.sizes) image.sizes = props.sizes;
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;
  const ready = image.decode().catch((error) => {
    preparedImages.delete(key);
    throw error;
  });
  preparedImages.set(key, ready);
  return ready;
}

// Wait for the selected artwork to decode before starting its entrance.
// Repeated navigation shares the same in-flight requests.
export async function prepareProjectArtwork(project: PortfolioProject) {
  const scene = project.scene;
  if (!scene) {
    await decodeImage(
      getImageProps({
        src: project.image.src,
        width: project.image.width,
        height: project.image.height,
        alt: "",
        quality: imageQuality,
        sizes: "(max-width: 599px) 100vw, (max-width: 760px) 74vw, 39vw",
      }).props,
    );
    return;
  }
  await Promise.all(
    scene.layers.map((layer) =>
      decodeImage(getImageProps(layerImage(layer, scene.width)).props),
    ),
  );
}

function position(
  bounds: ArtworkBounds,
  width: number,
  height: number,
): CSSProperties {
  return {
    left: `${(100 * bounds[0]) / width}%`,
    top: `${(100 * bounds[1]) / height}%`,
    width: `${(100 * bounds[2]) / width}%`,
    height: `${(100 * bounds[3]) / height}%`,
  };
}

function ArtworkPiece({
  layer,
  width,
  height,
  reduced,
  delay,
  parent,
  children,
}: {
  layer: ArtworkLayer;
  width: number;
  height: number;
  reduced: boolean;
  delay: number;
  parent?: ArtworkLayer;
  children?: ReactNode;
}) {
  const clip = layer.clip;
  const viewport = clip?.bounds;
  const relative: ArtworkBounds = viewport
    ? [
        layer.bounds[0] - viewport[0],
        layer.bounds[1] - viewport[1],
        layer.bounds[2],
        layer.bounds[3],
      ]
    : parent
      ? [
          layer.bounds[0] - parent.bounds[0],
          layer.bounds[1] - parent.bounds[1],
          layer.bounds[2],
          layer.bounds[3],
        ]
      : layer.bounds;
  const localWidth = viewport?.[2] ?? parent?.bounds[2] ?? width;
  const localHeight = viewport?.[3] ?? parent?.bounds[3] ?? height;
  const piece = (
    <m.div
      data-artwork-layer={layer.id}
      className="absolute"
      variants={artworkMovement(layer, reduced, delay)}
      style={{
        ...position(relative, localWidth, localHeight),
        clipPath: layer.sourceClip
          ? `polygon(${layer.sourceClip.map(([x, y]) => `${x}% ${y}%`).join(", ")})`
          : undefined,
      }}
    >
      <Image
        {...layerImage(layer, width)}
        loading="eager"
        draggable={false}
        className="block size-full"
      />
      {children}
    </m.div>
  );
  return viewport ? (
    <div
      className="absolute"
      style={{
        ...position(
          parent
            ? [
                viewport[0] - parent.bounds[0],
                viewport[1] - parent.bounds[1],
                viewport[2],
                viewport[3],
              ]
            : viewport,
          parent?.bounds[2] ?? width,
          parent?.bounds[3] ?? height,
        ),
        ...(clip
          ? {
              overflow: "clip",
              borderRadius: `${clip.radius.map((r) => `${(100 * r) / clip.bounds[2]}%`).join(" ")} / ${clip.radius.map((r) => `${(100 * r) / clip.bounds[3]}%`).join(" ")}`,
            }
          : {}),
      }}
    >
      {piece}
    </div>
  ) : (
    piece
  );
}

export function ProjectArtwork({
  project,
  active,
  initial,
  widestAspect,
}: {
  project: PortfolioProject;
  active: boolean;
  initial: boolean;
  widestAspect: number;
}) {
  const reduced = !!useReducedMotion();
  const [width, height] = projectFrame(project);
  const scene = project.scene;
  const [left, top] = project.image.cardBounds;
  const delays = scene ? artworkDelays(scene.layers) : [];
  return (
    <LazyMotion features={domAnimation} strict>
      <m.figure
        data-project-artwork={project.name}
        data-active={active}
        aria-hidden={!active}
        className="pointer-events-none absolute top-1/2 left-1/2 h-full -translate-1/2"
        style={{ width: `${(100 * width) / height / widestAspect}%` }}
        initial={initial ? false : "hidden"}
        animate={active ? "shown" : "hidden"}
        variants={artworkVisibility(reduced)}
      >
        <figcaption className="sr-only">{project.alt}</figcaption>
        {scene ? (
          scene.layers
            .filter((layer) => !layer.parent)
            .map((layer) => (
              <ArtworkPiece
                key={layer.id}
                layer={layer}
                width={width}
                height={height}
                reduced={reduced}
                delay={delays[scene.layers.indexOf(layer)]}
              >
                {scene.layers
                  .filter((child) => child.parent === layer.id)
                  .map((child) => (
                    <ArtworkPiece
                      key={child.id}
                      layer={child}
                      parent={layer}
                      width={width}
                      height={height}
                      reduced={reduced}
                      delay={delays[scene.layers.indexOf(child)]}
                    />
                  ))}
              </ArtworkPiece>
            ))
        ) : (
          <m.div
            className="absolute inset-0"
            variants={artworkMovement(
              {
                id: "temporary-poster",
                src: project.image.src,
                width: project.image.width,
                height: project.image.height,
                bounds: [0, 0, width, height],
                motion: "panel",
                delay: 0.04,
              },
              reduced,
              0.04,
            )}
          >
            <Image
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt=""
              loading="eager"
              quality={imageQuality}
              sizes="(max-width: 599px) 100vw, (max-width: 760px) 74vw, 39vw"
              draggable={false}
              className="absolute h-auto max-w-none"
              style={{
                width: `${(100 * project.image.width) / width}%`,
                left: `${(-100 * left) / width}%`,
                top: `${(-100 * top) / height}%`,
              }}
            />
          </m.div>
        )}
      </m.figure>
    </LazyMotion>
  );
}
