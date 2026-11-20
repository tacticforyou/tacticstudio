import type { Metadata } from "next";
import { LandingPage } from "@/app/_landing/landing";
import { siteName, siteUrl } from "@/lib/site";

const title = "تاکتیک استودیو";
const description =
  "استراتژی برند، طراحی وب‌سایت و اپلیکیشن، هویت بصری و خدمات هوش مصنوعی برای رشد کسب‌وکار شما.";
const socialImage = {
  url: "/images/social/tactic-studio.png",
  width: 2400,
  height: 1260,
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
