import type { ReactNode } from "react";
import { Actions } from "../components/actions";
import { Art, Portrait, Wave } from "../components/art";
import { BackToTopLink } from "../components/back-to-top-link";
import { Tagline } from "../components/tagline";
import { StudioWordmark } from "../components/studio-wordmark";
import { FooterWaterBackground } from "../components/footer-water-background";
import { contact } from "../copy";

function FooterColumn({
  title,
  children,
  className = "studio-tablet:col-span-2",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"studio-footer-column " + className}>
      <h2 className="mb-[calc(20*var(--u))] text-[max(0.87rem,calc(20*var(--u)))] leading-[max(1.2rem,calc(28*var(--u)))] font-semibold">
        {title}
      </h2>
      <ul className="grid gap-[calc(12*var(--u))]">{children}</ul>
    </div>
  );
}

export function Footer() {
  const emailDomainStart = contact.email.lastIndexOf("@");

  return (
    <footer id="contact" className="studio-band studio-footer">
      <FooterWaterBackground>
        <Portrait className="studio-footer-face" />
      </FooterWaterBackground>
      <div className="studio-shell relative text-center studio-tablet:grid studio-tablet:grid-cols-6 studio-tablet:items-start studio-tablet:gap-x-6 studio-tablet:gap-y-10 studio-tablet:[&>p]:col-span-full">
        <Tagline />
        <div className="mx-auto mt-[calc(106*var(--u))] grid min-h-[calc(210*var(--u))] w-full max-w-[calc(1117*var(--u))] grid-cols-4 gap-x-[min(12.44%,calc(139*var(--u)))] text-start studio-mobile:mt-12 studio-mobile:grid-cols-2 studio-mobile:gap-x-4 studio-mobile:gap-y-6 studio-tablet:contents">
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
          <FooterColumn
            title="ارتباط با ما"
            className="studio-tablet:col-span-2 studio-tablet:row-start-3"
          >
            <li>
              <a
                className="inline-block max-w-full text-right"
                dir="ltr"
                href={"mailto:" + contact.email}
              >
                <span className="whitespace-nowrap">
                  {contact.email.slice(0, emailDomainStart)}
                </span>
                <wbr />
                <span className="whitespace-nowrap">
                  {contact.email.slice(emailDomainStart)}
                </span>
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
        <div className="studio-tablet:col-span-4 studio-tablet:row-start-3 studio-tablet:mt-4 studio-tablet:w-[calc(50%+0.75rem+193*var(--u))] studio-tablet:justify-self-start studio-tablet:[&_.studio-button]:min-h-11 studio-tablet:[&_.studio-button]:min-w-0 studio-tablet:[&_.studio-button]:flex-1 studio-tablet:[&_.studio-button]:px-2 studio-tablet:[&>div]:mx-auto studio-tablet:[&>div]:w-full studio-tablet:[&>div]:max-w-80">
          <a
            href="#top"
            className="mx-auto mt-[calc(46*var(--u))] mb-[calc(47*var(--u))] block w-[calc(308*var(--u))] studio-tablet:mt-0 studio-tablet:mb-6"
          >
            <StudioWordmark variant="footer" />
          </a>
          <Actions />
        </div>
      </div>
      <BackToTopLink>
        <Art name="icon-arrow-up.svg" sizes="108px" />
      </BackToTopLink>
      <Wave name="footer-wave.svg" className="studio-footer-wave" />
      <Wave />
      <Wave name="footer-wave-left.svg" className="studio-footer-wave-left" />
      <Wave name="footer-wave-left.svg" className="studio-footer-wave-right" />
    </footer>
  );
}
