import Link from "next/link";
import { Art, Wave } from "../components/art";
import { SectionHeading } from "../components/section-heading";
import { PortfolioCarousel } from "../portfolio-carousel";
import { portfolioProjects } from "../portfolio-projects";

export function Portfolio() {
  return (
    <PortfolioCarousel
      projects={portfolioProjects}
      heading={
        <SectionHeading
          id="work-title"
          title="پروژه‌های منتخب"
          subtitle="ایده‌ها، در دنیای واقعی."
          description="هر پروژه برای ما فرصتی است تا مسئله‌ای را به شکلی متفاوت ببینیم، راهکاری خلاقانه پیدا کنیم و آن را به تجربه‌ای ارزشمند تبدیل کنیم."
          action={
            <Link
              href="/projects"
              className="group mt-[calc(20*var(--u))] inline-flex min-h-11 items-center gap-3 rounded-sm text-[max(0.9rem,calc(18*var(--u)))] font-semibold hover:text-studio-focus active:opacity-70 motion-safe:transition-colors"
            >
              <span>مشاهده همه</span>
              <span
                aria-hidden="true"
                className="relative block h-6 w-9 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1"
              >
                <Art
                  name="icon-arrow-right.svg"
                  className="absolute top-1/2 left-1/2 aspect-179/96 w-[calc(36px*179/83)] -translate-1/2 rotate-180 opacity-60"
                />
              </span>
            </Link>
          }
        />
      }
      wave={<Wave />}
    />
  );
}
