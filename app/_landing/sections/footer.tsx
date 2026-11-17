import type { ReactNode } from "react";
import { Actions } from "../components/actions";
import { Art, Wave } from "../components/art";
import { Tagline } from "../components/tagline";
import { contact } from "../copy";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="studio-footer-column">
      <h2 className="mb-[calc(20*var(--u))] text-[max(0.87rem,calc(20*var(--u)))] leading-[max(1.2rem,calc(28*var(--u)))] font-semibold">
        {title}
      </h2>
      <ul className="grid gap-[calc(12*var(--u))]">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="studio-band studio-footer">
      <div className="studio-footer-background">
        <Art name="footer-glow.svg" className="studio-footer-glow" />
        <Art
          name="footer-portrait.webp"
          className="studio-footer-face"
          unoptimized
        />
      </div>
      <div className="studio-shell relative text-center">
        <Tagline />
        <div className="mx-auto mt-[calc(106*var(--u))] grid min-h-[calc(210*var(--u))] w-full max-w-[calc(1117*var(--u))] grid-cols-4 gap-x-[min(12.44%,calc(139*var(--u)))] text-start studio-mobile:mt-12 studio-mobile:grid-cols-2 studio-mobile:gap-x-4 studio-mobile:gap-y-6">
          <FooterColumn title="دسترسی سریع">
            <li>
              <a href="#top">صفحه اصلی</a>
            </li>
            <li>
              <a href="#approach">درباره ما</a>
            </li>
            <li>
              <a href="#approach-title">رویکرد ما</a>
            </li>
            <li>
              <a href="#work">نمونه‌کارها</a>
            </li>
            <li>
              <a href="#contact">تماس با ما</a>
            </li>
          </FooterColumn>
          <FooterColumn title="خدمات ما">
            <li>
              <a href="#service-brand">استراتژی و هویت برند</a>
            </li>
            <li>
              <a href="#service-web">طراحی وب‌سایت</a>
            </li>
            <li>
              <a href="#service-ai">خدمات هوش مصنوعی</a>
            </li>
            <li>تولید محتوای خلاقانه</li>
            <li>طراحی محصول</li>
          </FooterColumn>
          <FooterColumn title="ما را دنبال کنید">
            <li>اینستاگرام</li>
            <li>لینکدین</li>
            <li>دریبل</li>
            <li>بیهنس</li>
            <li>تلگرام</li>
          </FooterColumn>
          <FooterColumn title="ارتباط با ما">
            <li>
              <a
                className="inline-block wrap-anywhere"
                dir="ltr"
                href={"mailto:" + contact.email}
              >
                {contact.email}
              </a>
            </li>
            <li>
              <a
                className="inline-block wrap-anywhere"
                dir="ltr"
                href={"tel:" + contact.phoneNumber}
              >
                {contact.phone}
              </a>
            </li>
            <li>واتس‌اپ</li>
            <li>تلگرام</li>
            <li>بله</li>
          </FooterColumn>
        </div>
        <a
          href="#top"
          className="mx-auto mt-[calc(46*var(--u))] mb-[calc(47*var(--u))] block w-[calc(308*var(--u))]"
        >
          <Art
            className="aspect-344/91"
            name="wordmark-footer.svg"
            alt="تاکتیک"
            sizes="308px"
          />
        </a>
        <Actions />
      </div>
      <a
        href="#top"
        className="studio-back-to-top"
        aria-label="بازگشت به بالای صفحه"
        data-click-sound="back-to-top"
      >
        <Art name="icon-arrow-up.svg" sizes="108px" />
      </a>
      <Wave name="footer-wave.svg" className="studio-footer-wave" />
      <Wave name="footer-wave-center.svg" />
      <Wave name="footer-wave-left.svg" className="studio-footer-wave-left" />
      <Wave name="footer-wave-right.svg" className="studio-footer-wave-right" />
    </footer>
  );
}
