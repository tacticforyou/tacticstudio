import { Actions, ConsultationLink } from "../components/actions";
import { Art, Portrait, Wave } from "../components/art";
import { ExperienceCount } from "../components/experience-count";
import { HeroBrandCard } from "../components/hero-brand-card";
import { HeroWaterBackground } from "../components/hero-water-background";
import { LogoRow } from "../components/logo-row";
import { ServiceCopy } from "../components/service-copy";
import { Tagline } from "../components/tagline";
import { StudioWordmark } from "../components/studio-wordmark";
import { TeamPortraits } from "../components/team-portraits";
import { WebServiceCard } from "../components/web-service-card";
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
    <div
      id="top"
      className="studio-band studio-hero px-0 pt-[calc(58*var(--u))] pb-[calc(78*var(--u))] studio-mobile:pt-[1.3rem] studio-tablet:pb-8"
    >
      <HeroWaterBackground>
        <Portrait className="studio-hero-face studio-hero-face-left" eager />
        <span className="studio-hero-face studio-hero-face-right">
          <Portrait side="right" className="studio-hero-right-art" eager />
        </span>
      </HeroWaterBackground>
      <SiteHeader />
      <div className="studio-shell relative studio-tablet:max-w-3xl">
        <div className="mx-auto mt-[calc(98*var(--u))] w-full max-w-[calc(1040*var(--u))] studio-mobile:mt-[clamp(2.5rem,9vw,3.6rem)]">
          <h1 className="flex min-h-[calc(101*var(--u))] items-center justify-center gap-[calc(22*var(--u))] text-[clamp(1.85rem,calc(56*var(--u)),3.5rem)] leading-[1.42] font-black max-[600px]:text-[clamp(1.85rem,8.6vw,2.375rem)] studio-mobile:flex-wrap studio-mobile:gap-x-[0.9rem] studio-mobile:gap-y-[0.65rem] studio-mobile:text-center studio-mobile:leading-[1.26] studio-tablet:text-[clamp(2rem,4vw,2.25rem)]">
            <StudioWordmark variant="hero" />
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
          className="mt-[calc(89*var(--u))] grid grid-cols-[minmax(0,326fr)_minmax(0,606fr)_minmax(0,326fr)] gap-[calc(8*var(--u))] max-[600px]:mt-[2.8rem] max-[600px]:grid-cols-2 studio-tablet:mt-10 studio-tablet:grid-cols-3 studio-tablet:grid-rows-[auto_minmax(7.5rem,auto)] studio-tablet:gap-2 studio-tablet:[grid-template-areas:'web_ai_brand'_'years_team_team']"
        >
          <WebServiceCard hero />
          <div className="grid min-w-0 grid-rows-[150fr_203fr] gap-[calc(8*var(--u))] max-[600px]:grid-rows-[auto_auto] max-[600px]:[grid-area:2/1/3/-1] studio-tablet:contents">
            <div className="studio-pane group/team relative flex items-center justify-between gap-[0.6rem] ps-[10%] pe-[12%] text-[max(0.8rem,calc(20*var(--u)))] font-light studio-mobile:min-h-[5.1rem] studio-mobile:ps-[8%] studio-mobile:pe-[8%] studio-tablet:[grid-area:team]">
              <TeamPortraits />
              <p>
                تیمی برای خلق نتایج{" "}
                <strong className="font-bold">بزرگ‌تر</strong>
              </p>
              <Art
                name="team-wave.svg"
                className="studio-team-wave duration-500 ease-out motion-safe:transition-transform motion-safe:group-hover/team:scale-x-[1.025] motion-safe:group-hover/team:scale-y-[0.86]"
              />
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-[calc(8*var(--u))] studio-tablet:contents">
              <div className="studio-hero-years studio-pane @container flex flex-col gap-1 max-[600px]:aspect-299/203 studio-compact:min-h-26 studio-compact:w-full studio-tablet:[grid-area:years]">
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
                <span className="sr-only">۱۳ سال یا بیشتر</span>
                <div
                  className="mt-auto flex items-baseline gap-[0.04em] self-end text-[clamp(1.75rem,43cqi-0.8rem,calc(94*var(--u)))] leading-none font-semibold text-[#0e100e] studio-tablet:text-[clamp(2rem,7vw,3.25rem)]"
                  dir="ltr"
                  aria-hidden="true"
                >
                  <span className="text-[0.75em] font-light">+</span>
                  <ExperienceCount />
                </div>
              </div>
              <article className="studio-hero-card studio-hero-ai max-[600px]:aspect-299/203 studio-compact:min-h-26 studio-compact:w-full studio-tablet:[grid-area:ai]">
                <Art
                  name="hero-ai-art.webp"
                  className="studio-card-art"
                  sizes="(min-width: 600px) and (max-width: 960px) min(32vw, 251px), (max-width: 640px) 50vw, 22vw"
                  eager
                />
                <div
                  className="studio-hero-ai-lights pointer-events-none absolute inset-0 -z-1"
                  aria-hidden="true"
                >
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <ServiceCopy
                  service="ai"
                  description="کسب و کارتان را هوشمند تر کنید"
                />
              </article>
            </div>
          </div>
          <HeroBrandCard
            badge={
              <Art
                name="hero-brand-badge.svg"
                className="absolute inset-0"
                eager
              />
            }
          >
            <Art
              name="hero-brand-art.svg"
              className="studio-hero-brand-art studio-mobile:left-0 studio-mobile:overflow-hidden studio-mobile:rounded-[inherit]"
              imageClassName="object-contain studio-mobile:object-cover"
              sizes="(max-width: 640px) 55vw, 28vw"
              eager
            />
            <Art
              name="hero-brand-badge-shadow.svg"
              className="studio-hero-brand-art studio-hero-brand-shadow pointer-events-none"
              eager
            />
            <ServiceCopy service="brand" />
          </HeroBrandCard>
        </section>
        <LogoRow />
      </div>
      <Wave />
    </div>
  );
}
