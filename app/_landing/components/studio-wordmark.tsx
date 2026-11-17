import { Art } from "./art";

const wordmarks = {
  hero: {
    name: "wordmark-hero.svg",
    className: "studio-wordmark studio-hero-mark",
    sizes: "310px",
    eager: true,
  },
  footer: {
    name: "wordmark-footer.svg",
    className: "studio-wordmark aspect-344/91",
    sizes: "308px",
  },
};

export function StudioWordmark({
  variant,
}: {
  variant: keyof typeof wordmarks;
}) {
  return <Art {...wordmarks[variant]} alt="تاکتیک" />;
}
