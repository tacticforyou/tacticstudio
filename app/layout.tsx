import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const peyda = localFont({
  src: [
    { path: "./_landing/fonts/peyda-light.woff2", weight: "300" },
    { path: "./_landing/fonts/peyda-regular.woff2", weight: "400" },
    { path: "./_landing/fonts/peyda-semibold.woff2", weight: "600" },
    { path: "./_landing/fonts/peyda-bold.woff2", weight: "700" },
    { path: "./_landing/fonts/peyda-black.woff2", weight: "900" },
  ],
  variable: "--font-peyda",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const yekan = localFont({
  src: "./_landing/fonts/yekan-bakh-fanum.woff2",
  variable: "--font-yekan",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  robots: siteUrl ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      className={`${peyda.variable} ${yekan.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
