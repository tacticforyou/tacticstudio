import type { Metadata } from "next";
import { LandingPage } from "@/app/_landing/landing";
import { siteName, siteUrl } from "@/lib/site";

const title = "تاکتیک استودیو | استراتژی برند، طراحی سایت و هویت بصری";
const description =
  "استراتژی برند، طراحی وب‌سایت و اپلیکیشن، هویت بصری و خدمات هوش مصنوعی برای رشد کسب‌وکار شما.";
const socialImage = {
  url: "/images/social/tactic-studio.png",
  width: 1200,
  height: 630,
  alt: "تاکتیک استودیو؛ کسب‌وکارت رو برای فرصت‌های بزرگ‌تر آماده می‌کنیم. نشان تاکتیک در کنار چهره یک ربات.",
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: siteUrl
    ? {
        type: "website",
        locale: "fa_IR",
        siteName,
        title,
        description,
        url: "/",
        images: [socialImage],
      }
    : undefined,
  twitter: siteUrl
    ? {
        card: "summary_large_image",
        title,
        description,
        images: [socialImage],
      }
    : undefined,
};

export default LandingPage;
