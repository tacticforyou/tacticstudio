import { animate } from "motion/mini";

const transition = { duration: 0.44, ease: [0.22, 1, 0.36, 1] as const };

export function prepareFaqMotion(grid: HTMLElement) {
  const gridTop = grid.getBoundingClientRect().top;
  const cards = Array.from(
    grid.querySelectorAll<HTMLElement>(".studio-faq-card"),
    (card) => {
      const surface = card.querySelector<HTMLElement>(".studio-faq-surface")!;
      const shadow = card.querySelector<HTMLElement>(".studio-faq-shadow")!;
      const { top, height } = surface.getBoundingClientRect();
      return { surface, shadow, top: top - gridTop, height };
    },
  );

  return () => {
    const nextGridTop = grid.getBoundingClientRect().top;
    const changes = cards.map(({ surface, shadow, top, height }) => {
      const next = surface.getBoundingClientRect();
      return {
        surface,
        shadow,
        translate: top - (next.top - nextGridTop),
        scale: height / next.height,
      };
    });

    const animations: ReturnType<typeof animate>[] = [];
    for (const { surface, shadow, translate, scale } of changes) {
      const resizes = Math.abs(scale - 1) > 0.001;
      if (Math.abs(translate) < 0.5 && !resizes) continue;

      animations.push(
        animate(
          [surface, shadow],
          {
            transform: [`translateY(${translate}px) scaleY(${scale})`, "none"],
          },
          transition,
        ),
      );

      if (resizes) {
        // Counter the card's scale so the text and wave retain their proportions.
        const steps = 16;
        const scales = Array.from(
          { length: steps + 1 },
          (_, step) => `1 ${1 / (scale + (1 - scale) * (step / steps))}`,
        );
        const contents = surface.querySelectorAll<HTMLElement>(
          ".studio-faq-content, .studio-card-wave",
        );
        animations.push(animate(contents, { scale: scales }, transition));
      }
    }
    return () => animations.forEach((animation) => animation.cancel());
  };
}
