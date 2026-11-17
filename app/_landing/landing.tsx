import Image from "next/image";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { approaches, contact, services, testimonials } from "./copy";
import { FaqGrid } from "./faq-grid";
import { HeaderMenu } from "./header-menu";
import { SectionEdgeAlignment } from "./section-edge-alignment";
import "./landing.css";

const peyda = localFont({
  src: [
    { path: "./fonts/peyda-light.woff2", weight: "300" },
    { path: "./fonts/peyda-regular.woff2", weight: "400" },
    { path: "./fonts/peyda-semibold.woff2", weight: "600" },
    { path: "./fonts/peyda-bold.woff2", weight: "700" },
    { path: "./fonts/peyda-black.woff2", weight: "900" },
  ],
  variable: "--font-peyda",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const yekan = localFont({
  src: "./fonts/yekan-bakh-fanum.woff2",
  variable: "--font-yekan",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

type ArtProps = {
  name: string;
  className?: string;
  imageClassName?: string;
  alt?: string;
  sizes?: string;
  eager?: boolean;
  unoptimized?: boolean;
};

function Art({
  name,
  className = "",
  imageClassName = "object-contain",
  alt = "",
  sizes = "30vw",
  eager = false,
  unoptimized = false,
}: ArtProps) {
  return (
    <span className={"studio-art " + className}>
      <Image
        src={"/images/landing/" + name}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        loading={eager ? "eager" : undefined}
        className={imageClassName}
      />
    </span>
  );
}

function StudioButton({
  tone,
  href,
  children,
}: {
  tone: "outline" | "sage" | "rose";
  href: string;
  children: ReactNode;
}) {
  return (
    <a className={"studio-button studio-button-" + tone} href={href}>
      <span className="studio-button-copy">{children}</span>
      <Art
        name={"button-wave-" + tone + ".svg"}
        className="studio-button-glint"
      />
    </a>
  );
}

function ConsultationLink({ header = false }: { header?: boolean }) {
  return (
    <StudioButton tone={header ? "outline" : "sage"} href="#contact">
      درخواست مشاوره
    </StudioButton>
  );
}

function Actions() {
  return (
    <div className="studio-actions flex flex-wrap items-center justify-center">
      <ConsultationLink />
      <StudioButton tone="rose" href="#work">
        نمونه کار ها
      </StudioButton>
    </div>
  );
}

function Tagline() {
  return (
    <p className="studio-tagline">
      کسب‌وکارت رو برای فرصت‌های{" "}
      <strong className="relative inline-block">
        بزرگ‌تر
        <Art
          className="studio-tagline-underline"
          name="tagline-hero-brush.svg"
        />
      </strong>{" "}
      <span className="whitespace-nowrap">آماده می‌کنیم.</span>
    </p>
  );
}

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

const clientLogos = [
  { word: "Magny", asset: "logo-magny.svg" },
  { word: "Aura", asset: "logo-aura.svg" },
  { word: "Exilex", asset: "logo-exilex.svg" },
  { word: "Cryptolemos", asset: "logo-cryptolemos.svg" },
  { word: "Visa2Go", asset: "logo-visa2go.svg" },
];

function LogoRow({ portfolio = false }: { portfolio?: boolean }) {
  const logos = portfolio
    ? clientLogos.map((logo) =>
        logo.word === "Exilex"
          ? { word: "Previsore", asset: "logo-previsore.svg" }
          : logo,
      )
    : clientLogos;

  return (
    <ul
      className={"studio-logos " + (portfolio ? "studio-logos-portfolio" : "")}
      dir="ltr"
    >
      {logos.map(({ word, asset }) => (
        <li
          key={word}
          className={word === "Previsore" ? "studio-logo-featured" : undefined}
        >
          <Art name={asset} alt={word} sizes="150px" />
        </li>
      ))}
    </ul>
  );
}

function SiteHeader() {
  return (
    <header className="studio-header">
      <a href="#top" className="studio-header-brand">
        <Art name="wordmark-nav.svg" alt="تاکتیک" sizes="112px" eager />
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

function ServiceCopy({
  service,
  title = services[service].title,
  description = services[service].description,
}: {
  service: keyof typeof services;
  title?: string;
  description?: string;
}) {
  return (
    <div className="studio-service-copy">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function SectionHeading({
  id,
  title,
  subtitle,
  description,
  stars = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stars?: boolean;
}) {
  return (
    <div className="studio-section-heading">
      <div className="relative">
        {stars && (
          <Art
            className="studio-heading-stars"
            name="process-stars.webp"
            sizes="178px"
          />
        )}
        <h2 id={id} className="relative">
          <span>{title}</span>
          <span className="studio-section-subtitle">{subtitle}</span>
        </h2>
      </div>
      <p>{description}</p>
    </div>
  );
}

function Wave({
  name = "edge-wave.svg",
  className = "",
}: {
  name?: string;
  className?: string;
}) {
  return (
    <Art className={"studio-wave " + className} name={name} sizes="360px" />
  );
}

function Hero() {
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
        <div className="studio-intro">
          <h1 className="studio-hero-title">
            <Art
              name="wordmark-hero.svg"
              className="studio-hero-mark"
              alt="تاکتیک"
              sizes="310px"
              eager
            />
            <HeroOrbs />
            <span>راه رسیدن به نتایج واقعی</span>
          </h1>
          <div className="studio-hero-lede">
            <Actions />
            <Tagline />
          </div>
        </div>
        <section aria-label="خدمات و تجربه تاکتیک" className="studio-hero-grid">
          <article className="studio-hero-card studio-hero-web studio-phone">
            <Art
              name="hero-web-art.webp"
              className="studio-card-art"
              sizes="(max-width: 640px) 50vw, 25vw"
              eager
            />
            <ServiceCopy service="web" />
          </article>
          <div className="studio-hero-middle">
            <div className="studio-team studio-pane">
              <Art
                name="hero-team-portraits.webp"
                className="studio-team-faces"
                unoptimized
                eager
              />
              <p>
                تیمی برای خلق نتایج <strong>بزرگ‌تر</strong>
              </p>
              <Art name="team-wave.svg" className="studio-team-wave" />
            </div>
            <div className="studio-hero-small-grid">
              <div className="studio-hero-years studio-pane">
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
                <div className="studio-years-count" dir="ltr">
                  <span>+</span>۱۳
                </div>
              </div>
              <article className="studio-hero-card studio-hero-ai">
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

type ProcessLayer = {
  name: string;
  layer: "mark" | "figure" | "texture" | "light-start" | "light-end";
  unoptimized?: boolean;
  imageClassName?: string;
};

const processScenes: Record<
  (typeof approaches)[number]["art"],
  readonly ProcessLayer[]
> = {
  strategy: [
    { name: "process-strategy-mark.svg", layer: "mark" },
    {
      name: "process-strategy-focus.webp",
      layer: "figure",
      unoptimized: true,
      imageClassName: "object-cover object-[16%_center]",
    },
    {
      name: "process-strategy-glow.webp",
      layer: "light-start",
      unoptimized: true,
    },
    {
      name: "process-strategy-glow.webp",
      layer: "light-end",
      unoptimized: true,
    },
  ],
  design: [
    { name: "process-design-mark.svg", layer: "mark" },
    { name: "process-design-grid.svg", layer: "texture" },
    {
      name: "process-design-hand@2x.webp",
      layer: "figure",
      unoptimized: true,
    },
    {
      name: "process-design-left-glow.webp",
      layer: "light-start",
      unoptimized: true,
    },
    {
      name: "process-design-right-glow.webp",
      layer: "light-end",
      unoptimized: true,
    },
  ],
  development: [
    { name: "process-development-cube.webp", layer: "mark" },
    {
      name: "process-development-hands@2x.webp",
      layer: "figure",
      unoptimized: true,
    },
  ],
};

function Approach() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-title"
      className="studio-shell studio-approach"
    >
      <SectionHeading
        id="approach-title"
        title="نتایج بزرگ"
        subtitle="از تصمیم‌های درست شروع می‌شوند."
        description="هر کسب‌وکار مسیر متفاوتی برای رشد دارد. ما با شناخت نیازها، تدوین استراتژی و اجرای خلاقانه، راهکارهایی متناسب با اهداف واقعی هر کسب‌وکار طراحی می‌کنیم."
        stars
      />
      <ol className="studio-steps">
        {approaches.map(({ number, title, description, art }) => (
          <li key={number} className={"studio-step studio-step-" + art}>
            <div className="studio-step-label">
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
              <span className="studio-step-number">{number}</span>
              <span
                className="studio-card-wave"
                data-tone={art === "development" ? "rose" : undefined}
                aria-hidden="true"
              />
            </div>
            <div className="studio-step-art">
              <div className="studio-step-scene">
                {processScenes[art].map(
                  ({ name, layer, unoptimized, imageClassName }) => (
                    <Art
                      key={layer}
                      name={name}
                      className={"studio-step-" + layer}
                      imageClassName={imageClassName}
                      sizes="(max-width: 640px) 80vw, 40vw"
                      unoptimized={unoptimized}
                    />
                  ),
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Portfolio() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="studio-band studio-portfolio"
    >
      <div className="studio-shell relative">
        <SectionHeading
          id="work-title"
          title="پروژه‌های منتخب"
          subtitle="ایده‌ها، در دنیای واقعی."
          description="هر پروژه برای ما فرصتی است تا مسئله‌ای را به شکلی متفاوت ببینیم، راهکاری خلاقانه پیدا کنیم و آن را به تجربه‌ای ارزشمند تبدیل کنیم."
        />
        <div className="studio-portfolio-frame">
          <button
            type="button"
            disabled
            aria-label="پروژه بعدی"
            className="studio-project-arrow"
            data-direction="right"
          >
            <Art name="icon-arrow-right.svg" sizes="138px" />
          </button>
          <figure>
            <Art
              name="previsore-project@2x.webp"
              className="studio-project-art"
              alt="هویت بصری و طراحی اپلیکیشن Prevaisor، همراه با نمونه لوگو، پوستر و رابط کاربری"
              unoptimized
            />
          </figure>
          <button
            type="button"
            disabled
            aria-label="پروژه قبلی"
            className="studio-project-arrow"
            data-direction="left"
          >
            <Art name="icon-arrow-left.svg" sizes="138px" />
          </button>
        </div>
        <LogoRow portfolio />
      </div>
      <Wave name="portfolio-wave.svg" />
    </section>
  );
}

function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="studio-band studio-services"
    >
      <Wave name="edge-wave-down.svg" className="studio-wave-top" />
      <div className="studio-shell relative">
        <SectionHeading
          id="services-title"
          title="خدمات تاکتیک"
          subtitle="از ایده تا اجرا، همه‌چیز برای رشد برند شما."
          description="ما با ترکیب استراتژی، طراحی و فناوری، راهکارهایی خلق می‌کنیم که به کسب‌وکار شما کمک می‌کنند هویتی متمایز بسازد، تجربه‌ای بهتر ارائه دهد و در فضای دیجیتال رشد کند."
        />
        <div className="studio-services-grid">
          <article
            id="service-web"
            className="studio-service-card studio-service-web studio-phone"
          >
            <Art
              name="services-web-detail.webp"
              className="studio-card-art"
              unoptimized
            />
            <ServiceCopy service="web" />
          </article>
          <article
            id="service-brand"
            className="studio-service-card studio-service-brand"
          >
            <Art name="services-brand-art.svg" className="studio-card-art" />
            <ServiceCopy service="brand" />
          </article>
          <article
            id="service-ai"
            className="studio-service-card studio-service-ai"
          >
            <Art
              name="services-ai-portrait.webp"
              className="studio-service-face"
              unoptimized
            />
            <Art
              name="services-ai-stars.webp"
              className="studio-service-stars"
              sizes="180px"
            />
            <ServiceCopy service="ai" />
          </article>
        </div>
        <div className="studio-services-action">
          <ConsultationLink />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="studio-band studio-testimonials"
    >
      <Art
        name="testimonials-glow.svg"
        className="studio-testimonials-glow"
        unoptimized
      />
      <Art
        name="testimonials-art@2x.webp"
        className="studio-testimonials-art"
        unoptimized
      />
      <div className="studio-shell relative">
        <SectionHeading
          id="testimonials-title"
          title="از تجارب بشنوید"
          subtitle="اعتماد، در تجربه ساخته می‌شود."
          description="بهترین روایت از یک همکاری موفق را کسانی بیان می‌کنند که آن را تجربه کرده‌اند. تجربه مشتریان ما، بخشی از داستان تاکتیک است."
        />
        <div className="studio-quotes">
          {testimonials.map(({ name, image, role, quote }) => (
            <figure className="studio-quote studio-pane" key={name}>
              <Art name={image} className="studio-quote-emblem" sizes="93px" />
              <div>
                <figcaption>
                  <strong lang="en" dir="ltr">
                    {name}
                  </strong>
                  <span>{role}</span>
                </figcaption>
                <blockquote>{quote}</blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>
      <Wave />
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="studio-shell studio-faq">
      <SectionHeading
        id="faq-title"
        title="سؤالات شما"
        subtitle="+ پاسخ های ما"
        description="پیش از شروع همکاری، ممکن است درباره خدمات، هزینه‌ها یا نحوه اجرای پروژه سؤالاتی داشته باشید. پاسخ برخی از رایج‌ترین پرسش‌ها را اینجا گردآوری کرده‌ایم تا با دید روشن‌تری تصمیم بگیرید."
      />
      <FaqGrid />
    </section>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="studio-footer-column">
      <h2>{title}</h2>
      <ul>{children}</ul>
    </div>
  );
}

function Footer() {
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
        <div className="studio-footer-grid">
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
              <a dir="ltr" href={"mailto:" + contact.email}>
                {contact.email}
              </a>
            </li>
            <li>
              <a dir="ltr" href={"tel:" + contact.phoneNumber}>
                {contact.phone}
              </a>
            </li>
            <li>واتس‌اپ</li>
            <li>تلگرام</li>
            <li>بله</li>
          </FooterColumn>
        </div>
        <a href="#top" className="studio-footer-brand">
          <Art name="wordmark-footer.svg" alt="تاکتیک" sizes="308px" />
        </a>
        <Actions />
      </div>
      <a
        href="#top"
        className="studio-back-to-top"
        aria-label="بازگشت به بالای صفحه"
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

export function LandingPage() {
  return (
    <div
      className={peyda.variable + " " + yekan.variable + " studio-landing"}
      dir="rtl"
    >
      <main>
        <Hero />
        <Approach />
        <Portfolio />
        <Services />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
      <SectionEdgeAlignment />
    </div>
  );
}
