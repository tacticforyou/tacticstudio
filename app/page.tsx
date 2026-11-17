import type { Metadata } from "next";
import { LandingPage } from "@/app/_landing/landing";
import { siteName, siteUrl } from "@/lib/site";

const title = "تاکتیک استودیو";
const description =
  "استراتژی برند، طراحی وب‌سایت و اپلیکیشن، هویت بصری و خدمات هوش مصنوعی برای رشد کسب‌وکار شما.";

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
      }
    : undefined,
};

export default LandingPage;
