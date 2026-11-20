import { Wave } from "../components/art";
import { SectionHeading } from "../components/section-heading";
import { PortfolioCarousel } from "../portfolio-carousel";

const projects = [
  {
    name: "Prevaisor",
    logo: {
      asset: "logo-previsore.svg",
      width: 277.772,
      height: 60.043,
      symbolWidth: 49,
    },
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
    logo: { asset: "logo-doshi.svg", width: 271, height: 57, symbolWidth: 66 },
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
    logo: { asset: "logo-radian.svg", width: 276, height: 62, symbolWidth: 41 },
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
    logo: { asset: "logo-north.svg", width: 281, height: 52, symbolWidth: 52 },
    image: {
      src: "/images/landing/collision-centers-project.png",
      width: 3043,
      height: 2217,
      cardBounds: [88, 0, 2912, 2217],
    },
    alt: "هویت بصری Collision Centers، همراه با لوگو، تابلو، خودرو و نمونه نمایش روی گوشی",
    color: "#F1D88D",
  },
  {
    name: "Milan",
    logo: { asset: "logo-milan.svg", width: 206, height: 60, symbolWidth: 60 },
    image: {
      src: "/images/landing/milan-project.png",
      width: 716,
      height: 544,
      cardBounds: [51, 22, 716, 544],
    },
    alt: "هویت بصری Milan، همراه با لوگو و نمونه نمایش برند روی گوشی، ساعت و کارت",
    color: "#C8CBD1",
  },
  {
    name: "Puressis",
    logo: {
      asset: "logo-puressis.svg",
      width: 271,
      height: 82,
      symbolWidth: 64,
    },
    image: {
      src: "/images/landing/puressis-project.png",
      width: 712,
      height: 492,
      cardBounds: [39, 0, 712, 492],
    },
    alt: "هویت بصری Puressis، همراه با لوگوی محصولات مراقبت از حیوانات و نمونه بسته بندی شامپو",
    color: "#C9D3BE",
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
      wave={<Wave />}
    />
  );
}
