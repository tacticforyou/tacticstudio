import { Art, Wave } from "../components/art";
import { SectionHeading } from "../components/section-heading";
import { testimonials } from "../copy";

export function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="studio-band studio-testimonials overflow-clip bg-studio-white pt-[calc(61*var(--u))] pb-[calc(282*var(--u))] studio-mobile:pt-[2.3rem] studio-mobile:pb-[5.3rem]"
    >
      <Art
        name="testimonials-art@2x.webp"
        className="studio-testimonials-art"
        unoptimized
      />
      <div className="studio-shell relative">
        <SectionHeading
          id="testimonials-title"
          title="از تجارب بشنوید"
          subtitle="اعتماد، در تجربه ساخته می‌شود."
          description="بهترین روایت از یک همکاری موفق را کسانی بیان می‌کنند که آن را تجربه کرده‌اند. تجربه مشتریان ما، بخشی از داستان تاکتیک است."
        />
        <div className="mt-[calc(185*var(--u))] grid grid-cols-2 gap-x-[calc(62*var(--u))] gap-y-[calc(58*var(--u))] studio-mobile:mt-12 studio-mobile:gap-4 studio-compact:grid-cols-1">
          {testimonials.map(({ name, image, role, quote }) => (
            <figure
              className="studio-quote studio-pane flex min-h-[calc(150*var(--u))] items-center gap-[calc(18*var(--u))] px-[calc(30*var(--u))] py-[calc(20*var(--u))] studio-condensed:px-[4%] studio-mobile:gap-[0.55rem] studio-mobile:px-[0.85rem] studio-mobile:py-[0.85rem]"
              key={name}
            >
              <Art
                name={image}
                className="aspect-square w-[calc(93*var(--u))] flex-none studio-mobile:w-11"
                sizes="93px"
              />
              <div>
                <figcaption className="mb-[0.25em] flex flex-wrap items-baseline gap-x-[calc(24*var(--u))] gap-y-0">
                  <strong
                    lang="en"
                    dir="ltr"
                    className="text-[max(0.95rem,calc(24*var(--u)))]"
                  >
                    {name}
                  </strong>
                  <span className="text-[max(0.7rem,calc(15*var(--u)))] text-[#59634b]">
                    {role}
                  </span>
                </figcaption>
                <blockquote className="text-[max(0.76rem,calc(16*var(--u)))] leading-[1.45] font-light">
                  {quote}
                </blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <Wave />
    </section>
  );
}
