import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EffectLab } from "./effect-lab";

export const metadata: Metadata = {
  title: "آزمایشگاه حرکت",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <main
      dir="rtl"
      className="min-h-dvh bg-[#efefe7] font-studio-body text-studio-ink"
    >
      <div className="mx-auto max-w-6xl px-5 pt-7 pb-14 sm:px-9 sm:pt-9">
        <header className="flex items-center justify-between gap-4 border-b border-studio-ink/15 pb-4 text-sm">
          <span className="font-semibold">تاکتیک استودیو</span>
          <Link
            href="/"
            className="underline decoration-studio-sage underline-offset-4 hover:decoration-current"
          >
            بازگشت به سایت
          </Link>
        </header>
        <div className="py-7 sm:pt-9 sm:pb-6">
          <h1 className="text-4xl leading-tight font-black sm:text-5xl">
            آزمایشگاه حرکت
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            نشانگر را روی هر قاب حرکت دهید و افکت دلخواهتان را انتخاب کنید.
          </p>
        </div>
        <EffectLab />
      </div>
    </main>
  );
}
