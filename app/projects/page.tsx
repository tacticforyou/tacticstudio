import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { portfolioProjects } from "@/app/_landing/portfolio-projects";
import { imageQuality } from "@/lib/image-quality";
import { siteName, siteUrl } from "@/lib/site";

const title = "پروژه‌های تاکتیک";
const description =
  "مجموعه پروژه‌های هویت بصری، برندینگ و طراحی دیجیتال تاکتیک استودیو.";
const socialImage = {
  url: "/images/social/tactic-studio.png",
  width: 2400,
  height: 1260,
  alt: "تاکتیک استودیو؛ کسب‌وکارت رو برای فرصت‌های بزرگ‌تر آماده می‌کنیم.",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: siteUrl ? { canonical: "/projects" } : undefined,
  openGraph: siteUrl
    ? {
        type: "website",
        locale: "fa_IR",
        siteName,
        title,
        description,
        url: "/projects",
        images: [socialImage],
      }
    : undefined,
  twitter: siteUrl
    ? { card: "summary_large_image", title, description, images: [socialImage] }
    : undefined,
};

const widestFrameAspect = Math.max(
  ...portfolioProjects.map(({ image: { cardBounds } }) => {
    const [left, top, right, bottom] = cardBounds;
    return (right - left) / (bottom - top);
  }),
);

export default function ProjectsPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-white px-6 py-10 font-studio-body text-studio-ink sm:px-10 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm font-semibold text-studio-focus underline-offset-4 hover:underline"
        >
          بازگشت به صفحه اصلی
        </Link>
        <header className="mt-12 mb-12 sm:mt-16 sm:mb-16">
          <h1 className="text-4xl leading-snug font-black sm:text-6xl">
            پروژه‌های تاکتیک
          </h1>
          <p className="mt-4 text-xl font-light sm:text-3xl">
            ایده‌ها، در دنیای واقعی.
          </p>
        </header>
        <ul
          className="grid gap-x-8 gap-y-12 md:grid-cols-2 md:gap-y-16"
          aria-label="پروژه‌های تاکتیک"
        >
          {portfolioProjects.map(({ name, image, alt, color }) => {
            const [left, top, right, bottom] = image.cardBounds;
            const cardWidth = right - left;
            const cardHeight = bottom - top;

            return (
              <li key={name}>
                <h2 dir="ltr" className="mb-4 text-right text-xl font-semibold">
                  {name}
                </h2>
                <div
                  className="overflow-hidden rounded-3xl p-8 sm:p-10"
                  style={{ backgroundColor: color }}
                >
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: widestFrameAspect }}
                  >
                    <figure
                      className="absolute top-1/2 left-1/2 h-full -translate-1/2"
                      style={{
                        width: `${(100 * cardWidth) / cardHeight / widestFrameAspect}%`,
                      }}
                    >
                      <Image
                        src={image.src}
                        alt={alt}
                        width={image.width}
                        height={image.height}
                        className="absolute h-auto max-w-none"
                        style={{
                          width: `${(100 * image.width) / cardWidth}%`,
                          left: `${(-100 * left) / cardWidth}%`,
                          top: `${(-100 * top) / cardHeight}%`,
                        }}
                        sizes="(max-width: 767px) calc(100vw - 7rem), (max-width: 1440px) calc(50vw - 7.5rem), 560px"
                        quality={imageQuality}
                      />
                    </figure>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
