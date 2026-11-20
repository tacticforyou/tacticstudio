import type { PortfolioLogo } from "./portfolio-logos";

export type ArtworkBounds = readonly [number, number, number, number];

export type ArtworkRegion = { bounds: ArtworkBounds; radius: ArtworkBounds };

export type ArtworkLayer = {
  id: string;
  src: string;
  width: number;
  height: number;
  bounds: ArtworkBounds;
  motion:
    | "panel"
    | "hero"
    | "backdrop"
    | "circle"
    | "accent"
    | "lift"
    | "diagonal"
    | "phone-emerge"
    | "masked-rise"
    | "write";
  delay: number;
  clip?: ArtworkRegion;
};

export type ArtworkScene = {
  width: number;
  height: number;
  layers: readonly ArtworkLayer[];
};

export type PortfolioProject = {
  name: string;
  logo: PortfolioLogo;
  image: {
    src: string;
    width: number;
    height: number;
    // The main frame excludes protrusions and determines the shared display height.
    cardBounds: readonly [number, number, number, number];
  };
  scene?: ArtworkScene;
  alt: string;
  color: string;
};

export function projectFrame(project: PortfolioProject) {
  if (project.scene)
    return [project.scene.width, project.scene.height] as const;
  const [left, top, right, bottom] = project.image.cardBounds;
  return [right - left, bottom - top] as const;
}
