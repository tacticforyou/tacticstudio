import { Art } from "./art";

const clientLogos = [
  { word: "Magny", asset: "logo-magny.svg" },
  { word: "Aura", asset: "logo-aura.svg" },
  { word: "Exilex", asset: "logo-exilex.svg" },
  { word: "Cryptolemos", asset: "logo-cryptolemos.svg" },
  { word: "Visa2Go", asset: "logo-visa2go.svg" },
];

export function LogoRow({ featuredProject }: { featuredProject?: string }) {
  return (
    <ul
      className={
        "mx-auto grid items-center justify-items-center gap-[0.6rem] studio-mobile:mt-8 studio-compact:gap-[0.35rem] " +
        (featuredProject
          ? "mt-[calc(94*var(--u))] w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]"
          : "studio-hero-logos mt-[calc(76*var(--u))] w-[94%] grid-cols-5")
      }
      dir="ltr"
    >
      {clientLogos.map(({ word, asset }) =>
        featuredProject && word === "Exilex" ? (
          <li key={word} className="w-[min(100%,calc(278*var(--u)))]">
            {featuredProject === "Prevaisor" ? (
              <Art
                className="h-[calc(55*var(--u))] studio-mobile:h-[2.4rem] studio-compact:h-[1.85rem]"
                name="logo-previsore.svg"
                alt={featuredProject}
                sizes="150px"
              />
            ) : (
              <span className="grid h-[calc(55*var(--u))] place-items-center text-center font-sans text-[clamp(0.65rem,1.55vw,1.5rem)] leading-tight font-bold text-white studio-mobile:h-[2.4rem] studio-compact:h-[1.85rem]">
                {featuredProject}
              </span>
            )}
          </li>
        ) : (
          <li
            key={word}
            className={
              "w-[min(90%,calc(139*var(--u)))] opacity-66" +
              (featuredProject
                ? ""
                : " motion-safe:transition-opacity motion-safe:duration-300 motion-safe:hover:opacity-92")
            }
          >
            <Art
              className="h-[calc(55*var(--u))] studio-mobile:h-[2.4rem] studio-compact:h-[1.85rem]"
              name={asset}
              alt={word}
              sizes="150px"
            />
          </li>
        ),
      )}
    </ul>
  );
}
