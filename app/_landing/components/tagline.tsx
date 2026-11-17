import { Art } from "./art";

export function Tagline() {
  return (
    <p className="text-[max(0.79rem,calc(17*var(--u)))] leading-[1.6] font-light studio-mobile:text-balance">
      کسب‌وکارت رو برای فرصت‌های{" "}
      <strong className="relative mx-[0.12em] inline-block font-studio-display text-[1.32em] font-bold [font-synthesis:none]">
        بزرگ‌تر
        <Art
          className="studio-tagline-underline"
          name="tagline-hero-brush.svg"
        />
      </strong>{" "}
      <span className="whitespace-nowrap">آماده می‌کنیم.</span>
    </p>
  );
}
