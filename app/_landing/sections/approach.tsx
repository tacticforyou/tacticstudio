import { Art } from "../components/art";
import { SectionHeading } from "../components/section-heading";
import { approaches } from "../copy";

type ProcessLayer = {
  name: string;
  layer: "mark" | "figure" | "texture" | "light-start" | "light-end";
  unoptimized?: boolean;
  imageClassName?: string;
};

const processScenes: Record<
  (typeof approaches)[number]["art"],
  readonly ProcessLayer[]
> = {
  strategy: [
    { name: "process-strategy-mark.svg", layer: "mark" },
    {
      name: "process-strategy-focus.webp",
      layer: "figure",
      unoptimized: true,
      imageClassName: "object-cover object-[16%_center]",
    },
    {
      name: "process-strategy-glow.webp",
      layer: "light-start",
      unoptimized: true,
    },
    {
      name: "process-strategy-glow.webp",
      layer: "light-end",
      unoptimized: true,
    },
  ],
  design: [
    { name: "process-design-mark.svg", layer: "mark" },
    { name: "process-design-grid.svg", layer: "texture" },
    {
      name: "process-design-hand@2x.webp",
      layer: "figure",
      unoptimized: true,
    },
    {
      name: "process-design-left-glow.webp",
      layer: "light-start",
      unoptimized: true,
    },
    {
      name: "process-design-right-glow.webp",
      layer: "light-end",
      unoptimized: true,
    },
  ],
  development: [
    { name: "process-development-cube.webp", layer: "mark" },
    {
      name: "process-development-hands@2x.webp",
      layer: "figure",
      unoptimized: true,
    },
  ],
};

const processStepStyles = {
  strategy: "studio-step-strategy",
  design: "studio-step-design",
  development: "studio-step-development",
};

export function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="studio-shell bg-studio-white pt-[calc(196*var(--u))] pb-[calc(224*var(--u))] studio-mobile:pt-18 studio-mobile:pb-16"
    >
      <SectionHeading
        id="approach-title"
        title="نتایج بزرگ"
        subtitle="از تصمیم‌های درست شروع می‌شوند."
        description="هر کسب‌وکار مسیر متفاوتی برای رشد دارد. ما با شناخت نیازها، تدوین استراتژی و اجرای خلاقانه، راهکارهایی متناسب با اهداف واقعی هر کسب‌وکار طراحی می‌کنیم."
        stars
      />
      <ol className="isolate mx-auto mt-[calc(88*var(--u))] grid w-full max-w-[calc(899*var(--u))] gap-[calc(65*var(--u))] studio-mobile:mt-[2.6rem] studio-mobile:max-w-none studio-mobile:gap-[1.3rem]">
        {approaches.map(({ number, title, description, art }) => (
          <li
            key={number}
            className={
              processStepStyles[art] +
              " studio-step grid min-h-[calc(203*var(--u))] gap-[calc(10*var(--u))] studio-mobile:min-h-34"
            }
          >
            <div className="studio-step-label flex items-center justify-between gap-[0.35rem] leading-[1.32] studio-mobile:flex-col studio-mobile:items-start studio-mobile:justify-center">
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="text-[clamp(2.7rem,calc(94*var(--u)),5.875rem)] leading-none font-semibold text-[#080908] studio-mobile:order-first studio-mobile:text-4xl">
                {number}
              </span>
              <span
                className="studio-card-wave"
                data-tone={art === "development" ? "rose" : undefined}
                aria-hidden="true"
              />
            </div>
            <div className="studio-step-art">
              <div className="studio-step-scene">
                {processScenes[art].map(
                  ({ name, layer, unoptimized, imageClassName }) => (
                    <Art
                      key={layer}
                      name={name}
                      className={"studio-step-" + layer}
                      imageClassName={imageClassName}
                      sizes="(max-width: 640px) 80vw, 40vw"
                      unoptimized={unoptimized}
                    />
                  ),
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
