import { Art } from "./art";

const clientLogos = [
  { word: "Magny", asset: "logo-magny.svg" },
  { word: "Aura", asset: "logo-aura.svg" },
  { word: "Exilex", asset: "logo-exilex.svg" },
  { word: "Cryptolemos", asset: "logo-cryptolemos.svg" },
  { word: "Visa2Go", asset: "logo-visa2go.svg" },
];

export function LogoRow({ portfolio = false }: { portfolio?: boolean }) {
  const logos = portfolio
    ? clientLogos.map((logo) =>
        logo.word === "Exilex"
          ? { word: "Previsore", asset: "logo-previsore.svg" }
          : logo,
      )
    : clientLogos;

  return (
    <ul
      className={
        "mx-auto grid items-center justify-items-center gap-[0.6rem] studio-mobile:mt-8 studio-compact:gap-[0.35rem] " +
        (portfolio
          ? "mt-[calc(94*var(--u))] w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]"
          : "mt-[calc(76*var(--u))] w-[94%] grid-cols-5")
      }
      dir="ltr"
    >
      {logos.map(({ word, asset }) => (
        <li
          key={word}
          className={
            word === "Previsore"
              ? "w-[min(100%,calc(278*var(--u)))]"
              : "w-[min(90%,calc(139*var(--u)))] opacity-66"
          }
        >
          <Art
            className="h-[calc(55*var(--u))] studio-mobile:h-[2.4rem] studio-compact:h-[1.85rem]"
            name={asset}
            alt={word}
            sizes="150px"
          />
        </li>
      ))}
    </ul>
  );
}
