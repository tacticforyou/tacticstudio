import type { Variants } from "motion/react";
import type { ArtworkLayer } from "./portfolio-project";

const ease = [0.22, 1, 0.36, 1] as const;
export const artworkExitDuration = 0.18;

// Schedule by visual role, independently of the source export's stacking order.
// Duplicate cutouts behind adjacent masks share the same entrance clock.
export function artworkDelays(layers: readonly ArtworkLayer[]) {
  let panel = 0;
  let detail = 0;
  let letter = 0;
  let lift = 0;
  return layers.map(({ motion }) => {
    switch (motion) {
      case "backdrop":
        return 0;
      case "panel":
        return Math.min(panel++ * 0.05, 0.25);
      case "circle":
        return 0.12;
      case "accent":
        return 0.4 + Math.min(detail++ * 0.04, 0.16);
      case "write":
        return 0.62 + letter++ * 0.06;
      case "logo":
        return 0.32;
      case "lift":
        return 0.18 + Math.min(lift++ * 0.06, 0.12);
      default:
        return 0.18;
    }
  });
}

export function artworkMovement(
  layer: ArtworkLayer,
  reduced: boolean,
  delay: number,
): Variants {
  const kind = layer.motion;
  // Reset poses only once the shared exit fade has hidden them. Value-specific
  // delays are cancelled on reversal, so navigation can resume the current pose.
  const reset = { duration: 0, delay: reduced ? 0 : artworkExitDuration };
  const hiddenTransition = {
    duration: reduced ? 0 : artworkExitDuration,
    delay: 0,
    ease,
    x: reset,
    y: reset,
    scale: reset,
    clipPath: reset,
  };
  if (kind === "phone-emerge" || kind === "masked-rise") {
    const diagonal = kind === "phone-emerge";
    return {
      hidden: {
        x: reduced || !diagonal ? 0 : "18%",
        y: reduced ? 0 : `${diagonal ? 90 : (layer.entryY ?? 92)}%`,
        opacity: 0,
        transition: hiddenTransition,
      },
      shown: {
        x: reduced || !diagonal ? 0 : [null, "-0.15%", "0%"],
        y: reduced ? 0 : diagonal ? [null, "-0.3%", "0%"] : "0%",
        opacity: 1,
        transition: {
          duration: reduced ? 0 : 0.8,
          delay: reduced ? 0 : delay,
          ...(diagonal ? { times: [0, 0.86, 1] } : {}),
          // The cutout is opaque before crossing the fixed mask's edge.
          opacity: { duration: reduced ? 0 : 0.12, delay: reduced ? 0 : delay },
          ease,
        },
      },
    };
  }
  const still = kind === "write" || kind === "backdrop";
  const offset =
    kind === "diagonal"
      ? { x: "10%", y: "8%" }
      : kind === "hero" || kind === "lift"
        ? { x: 0, y: "6%" }
        : kind === "logo"
          ? { x: 0, y: "3%" }
          : kind === "circle"
            ? { x: "-2%", y: "4%" }
            : { x: 0, y: still ? 0 : kind === "accent" ? 6 : 8 };
  const scale =
    still || kind === "logo"
      ? 1
      : kind === "accent"
        ? 0.96
        : kind === "circle"
          ? 0.97
          : 0.99;
  const duration =
    kind === "backdrop"
      ? 0.22
      : kind === "write"
        ? 0.16
        : kind === "logo"
          ? 0.56
          : kind === "hero" ||
              kind === "circle" ||
              kind === "diagonal" ||
              kind === "lift"
            ? 0.68
            : kind === "accent"
              ? 0.34
              : 0.38;
  return {
    hidden: {
      opacity: 0,
      x: reduced ? 0 : offset.x,
      y: reduced ? 0 : offset.y,
      scale: reduced ? 1 : scale,
      ...(kind === "write"
        ? { clipPath: reduced ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }
        : {}),
      transition: hiddenTransition,
    },
    shown: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      ...(kind === "write" ? { clipPath: "inset(0 0% 0 0)" } : {}),
      transition: {
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease,
      },
    },
  };
}

export function artworkVisibility(reduced: boolean): Variants {
  return {
    shown: {
      opacity: 1,
      visibility: "visible",
      transition: {
        duration: reduced ? 0 : 0.08,
        visibility: { duration: 0 },
        ease,
      },
    },
    hidden: {
      opacity: 0,
      visibility: "hidden",
      transition: {
        duration: reduced ? 0 : artworkExitDuration,
        visibility: { duration: 0, delay: reduced ? 0 : artworkExitDuration },
        ease,
      },
    },
  };
}
