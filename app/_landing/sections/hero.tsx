import { Actions, ConsultationLink } from "../components/actions";
import { Art, Wave } from "../components/art";
import { LogoRow } from "../components/logo-row";
import { ServiceCopy } from "../components/service-copy";
import { Tagline } from "../components/tagline";
import { HeaderMenu } from "../header-menu";

function HeroOrbs() {
  return (
    <span className="studio-hero-orbs" aria-hidden="true">
      <span className="studio-orbs-mask">
        <span className="studio-orb studio-orb-sage">
          <Art name="hero-orb-star.svg" className="studio-orb-star" eager />
        </span>
        <span className="studio-orb studio-orb-rose" />
        <span className="studio-orb studio-orb-rose" />
        <span className="studio-orb studio-orb-rose" />
      </span>
    </span>
  );
}

function SiteHeader() {
  return (
    <header className="relative z-3 mx-auto grid min-h-[calc(48*var(--u))] w-[min(calc(100%-3rem),calc(1136*var(--u)))] grid-cols-[auto_1fr_auto] items-center gap-4 studio-condensed:gap-[0.7rem] studio-mobile:w-[calc(100%-2rem)] studio-mobile:grid-cols-[1fr_auto]">
      <a href="#top">
        <Art
          className="aspect-112/26 w-[calc(112*var(--u))]"
          name="wordmark-nav.svg"
          alt="تاکتیک"
          sizes="112px"
          eager
        />
      </a>
      <HeaderMenu
        chevron={
          <Art
            className="studio-nav-chevron"
            name="nav-chevron.svg"
            sizes="18px"
            eager
          />
        }
      >
        <ConsultationLink header />
      </HeaderMenu>
    </header>
  );
}

export function Hero() {
  return (
    <div id="top" className="studio-band studio-hero">
      <Art
        name="hero-left.webp"
        className="studio-hero-face studio-hero-face-left"
        sizes="100vw"
        eager
      />
      <Art
        name="hero-right.webp"
        className="studio-hero-face studio-hero-face-right"
        sizes="100vw"
        eager
      />
      <SiteHeader />
      <div className="studio-shell relative">
        <div className="mx-auto mt-[calc(98*var(--u))] w-full max-w-[calc(1040*var(--u))] studio-mobile:mt-[clamp(2.5rem,9vw,3.6rem)]">
          <h1 className="flex min-h-[calc(101*var(--u))] items-center justify-center gap-[calc(22*var(--u))] text-[clamp(1.85rem,calc(56*var(--u)),3.5rem)] leading-[1.42] font-black studio-mobile:flex-wrap studio-mobile:gap-x-[0.9rem] studio-mobile:gap-y-[0.65rem] studio-mobile:text-center studio-mobile:text-[clamp(1.85rem,8.6vw,2.375rem)] studio-mobile:leading-[1.26]">
            <Art
              name="wordmark-hero.svg"
              className="studio-hero-mark"
              alt="تاکتیک"
              sizes="310px"
              eager
            />
            <HeroOrbs />
            <span className="whitespace-nowrap studio-mobile:basis-full studio-mobile:text-balance studio-mobile:whitespace-normal">
              راه رسیدن به نتایج واقعی
            </span>
          </h1>
          <div className="mt-[calc(44*var(--u))] flex items-center gap-[calc(56*var(--u))] studio-mobile:mt-5 studio-mobile:flex-col-reverse studio-mobile:gap-5 studio-mobile:text-center">
            <Actions />
            <Tagline />
          </div>
        </div>
        <section
          aria-label="خدمات و تجربه تاکتیک"
          className="mt-[calc(89*var(--u))] grid grid-cols-[326fr_606fr_326fr] gap-[calc(8*var(--u))] studio-mobile:mt-[2.8rem] studio-mobile:grid-cols-2 studio-mobile:gap-[0.6rem]"
        >
          <article className="studio-hero-card studio-hero-web studio-phone">
            <Art
              name="hero-web-art.webp"
              className="studio-card-art"
              sizes="(max-width: 640px) 50vw, 25vw"
              eager
            />
            <ServiceCopy service="web" />
          </article>
          <div className="grid min-w-0 grid-rows-[150fr_203fr] gap-[calc(8*var(--u))] studio-mobile:grid-rows-[auto_auto] studio-mobile:[grid-area:2/1/3/-1]">
            <div className="studio-pane relative flex items-center justify-between gap-[0.6rem] ps-[10%] pe-[12%] text-[max(0.8rem,calc(20*var(--u)))] font-light studio-mobile:min-h-[5.1rem] studio-mobile:ps-[8%] studio-mobile:pe-[8%]">
              <Art
                name="hero-team-portraits.webp"
                className="aspect-180/68 w-[38%] flex-none studio-mobile:max-w-36"
                unoptimized
                eager
              />
              <p>
                تیمی برای خلق نتایج{" "}
                <strong className="font-bold">بزرگ‌تر</strong>
              </p>
              <Art name="team-wave.svg" className="studio-team-wave" />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-[calc(8*var(--u))]">
              <div className="studio-hero-years studio-pane studio-mobile:aspect-299/203 studio-compact:min-h-26 studio-compact:w-full">
                <Art
                  name="years-stars.webp"
                  className="studio-years-stars"
                  sizes="300px"
                  eager
                />
                <p>
                  سال هایی که <strong>ساختیم</strong>
                  <br />و تجربه کردیم.
                </p>
                <div
                  className="absolute bottom-[8%] left-[8%] flex items-baseline gap-[0.04em] text-[clamp(2rem,calc(94*var(--u)),5.875rem)] leading-none font-semibold text-[#0e100e] studio-mobile:text-[clamp(2rem,12vw,calc(94*var(--u)))]"
                  dir="ltr"
                >
                  <span className="text-[0.75em] font-light">+</span>۱۳
                </div>
              </div>
              <article className="studio-hero-card studio-hero-ai studio-mobile:aspect-299/203 studio-compact:min-h-26 studio-compact:w-full">
                <Art
                  name="hero-ai-art.webp"
                  className="studio-card-art"
                  sizes="(max-width: 640px) 50vw, 22vw"
                  eager
                />
                <ServiceCopy
                  service="ai"
                  description="کسب و کارتان را هوشمند تر کنید"
                />
              </article>
            </div>
          </div>
          <article className="studio-hero-card studio-hero-brand">
            <Art
              name="hero-brand-art.svg"
              className="studio-hero-brand-art"
              sizes="(max-width: 640px) 55vw, 28vw"
              eager
            />
            <ServiceCopy service="brand" />
          </article>
        </section>
        <LogoRow />
      </div>
      <Wave />
    </div>
  );
}
