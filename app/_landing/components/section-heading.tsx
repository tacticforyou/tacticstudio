import { Art } from "./art";

export function SectionHeading({
  id,
  title,
  subtitle,
  description,
  stars = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stars?: boolean;
}) {
  return (
    <div className="studio-section-heading flex items-start justify-between gap-6 studio-mobile:block">
      <div className="relative">
        {stars && (
          <Art
            className="studio-heading-stars"
            name="process-stars.webp"
            sizes="178px"
          />
        )}
        <h2
          id={id}
          className="relative text-[clamp(2.35rem,calc(69*var(--u)),4.3125rem)] leading-[1.34] font-black studio-mobile:text-[clamp(1.75rem,7.4vw,2.5rem)]"
        >
          <span className="block">{title}</span>
          <span className="mt-[0.08em] block text-[clamp(1.6rem,calc(62*var(--u)),3.875rem)] leading-[1.38] font-light studio-mobile:text-[clamp(1.25rem,5.6vw,2rem)] studio-mobile:text-balance">
            {subtitle}
          </span>
        </h2>
      </div>
      <p className="mt-[calc(14*var(--u))] ml-[calc(25*var(--u))] w-[min(28%,calc(351*var(--u)))] flex-none text-[max(0.84rem,calc(18*var(--u)))] leading-[1.64] font-light text-[#4e5149] studio-mobile:mt-[0.9rem] studio-mobile:ml-0 studio-mobile:w-full studio-mobile:max-w-104">
        {description}
      </p>
    </div>
  );
}
