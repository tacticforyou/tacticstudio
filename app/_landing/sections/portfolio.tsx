import { Wave } from "../components/art";
import { SectionHeading } from "../components/section-heading";
import { PortfolioCarousel } from "../portfolio-carousel";

const projects = [
  {
    name: "Prevaisor",
    image: {
      src: "/images/landing/previsore-project@2x.webp",
      width: 1388,
      height: 1092,
      cardBounds: [0, 1, 1387, 1092],
    },
    alt: "هویت بصری و طراحی اپلیکیشن Prevaisor، همراه با نمونه لوگو، پوستر و رابط کاربری",
    color: "#A0CDF7",
  },
  {
    name: "Doshi",
    image: {
      src: "/images/landing/doshi-project.png",
      width: 2969,
      height: 2217,
      cardBounds: [150, 0, 2969, 2217],
    },
    alt: "هویت بصری Doshi، همراه با لوگو، کارت برند و نمونه کیف‌های دستی و دوشی",
    color: "#D4B7AA",
  },
  {
    name: "Radian Robots",
    image: {
      src: "/images/landing/radian-robots-project.png",
      width: 3232,
      height: 2625,
      cardBounds: [0, 76, 3232, 2625],
    },
    alt: "هویت بصری Radian Robots، همراه با لوگو، ربات و نمونه نمایش برند روی دستگاه‌ها",
    color: "#A8CFAD",
  },
  {
    name: "Collision Centers",
    image: {
      src: "/images/landing/collision-centers-project.png",
      width: 3043,
      height: 2217,
      cardBounds: [88, 0, 2912, 2217],
    },
    alt: "هویت بصری Collision Centers، همراه با لوگو، تابلو، خودرو و نمونه نمایش روی گوشی",
    color: "#F1D88D",
  },
] as const;

export function Portfolio() {
  return (
    <PortfolioCarousel
      projects={projects}
      heading={
        <SectionHeading
          id="work-title"
          title="پروژه‌های منتخب"
          subtitle="ایده‌ها، در دنیای واقعی."
          description="هر پروژه برای ما فرصتی است تا مسئله‌ای را به شکلی متفاوت ببینیم، راهکاری خلاقانه پیدا کنیم و آن را به تجربه‌ای ارزشمند تبدیل کنیم."
        />
      }
      wave={<Wave name="portfolio-wave.svg" />}
    />
  );
}
