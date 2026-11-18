"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

export function InitialArtworkImage({
  src,
  preview,
  className,
  imageClassName,
  alt,
  sizes,
  unoptimized,
}: {
  src: StaticImageData;
  preview: `data:image/${string}`;
  className: string;
  imageClassName: string;
  alt: string;
  sizes: string;
  unoptimized: boolean;
}) {
  const [loadedSource, setLoadedSource] = useState<string>();
  const ready = loadedSource === src.src;

  return (
    <span
      className={className}
      style={
        ready
          ? undefined
          : {
              backgroundImage: `url("${preview}")`,
              backgroundPosition: "50% 50%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        loading="eager"
        className={imageClassName}
        // A transparent image must never paint over its own preview. Swap
        // both in one render, including when loading finishes before hydration.
        style={{ objectFit: "contain", opacity: ready ? 1 : 0 }}
        onLoad={() => setLoadedSource(src.src)}
      />
    </span>
  );
}
