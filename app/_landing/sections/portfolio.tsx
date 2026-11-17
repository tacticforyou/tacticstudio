import { Art, Wave } from "../components/art";
import { LogoRow } from "../components/logo-row";
import { SectionHeading } from "../components/section-heading";

export function Portfolio() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="studio-band studio-portfolio overflow-hidden pt-[calc(25*var(--u))] pb-[calc(114*var(--u))] studio-mobile:pt-10 studio-mobile:pb-12"
    >
      <div className="studio-shell relative">
        <SectionHeading
          id="work-title"
          title="پروژه‌های منتخب"
          subtitle="ایده‌ها، در دنیای واقعی."
          description="هر پروژه برای ما فرصتی است تا مسئله‌ای را به شکلی متفاوت ببینیم، راهکاری خلاقانه پیدا کنیم و آن را به تجربه‌ای ارزشمند تبدیل کنیم."
        />
        <div className="mt-[calc(38*var(--u))] grid grid-cols-[minmax(0,1fr)_minmax(0,calc(694*var(--u)))_minmax(0,1fr)] place-items-center gap-4 studio-mobile:grid-cols-[minmax(0,1fr)_minmax(0,7fr)_minmax(0,1fr)] studio-mobile:gap-[0.45rem]">
          <button
            type="button"
            disabled
            aria-label="پروژه بعدی"
            className="studio-project-arrow justify-self-start"
            data-direction="right"
          >
            <Art name="icon-arrow-right.svg" sizes="138px" />
          </button>
          <figure className="w-full">
            <Art
              name="previsore-project@2x.webp"
              className="aspect-694/546 w-full"
              alt="هویت بصری و طراحی اپلیکیشن Prevaisor، همراه با نمونه لوگو، پوستر و رابط کاربری"
              unoptimized
            />
          </figure>
          <button
            type="button"
            disabled
            aria-label="پروژه قبلی"
            className="studio-project-arrow justify-self-end"
            data-direction="left"
          >
            <Art name="icon-arrow-left.svg" sizes="138px" />
          </button>
        </div>
        <LogoRow portfolio />
      </div>
      <Wave name="portfolio-wave.svg" />
    </section>
  );
}
