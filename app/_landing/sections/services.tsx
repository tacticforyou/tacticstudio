import { ConsultationLink } from "../components/actions";
import { Art, Portrait, Wave } from "../components/art";
import { SectionHeading } from "../components/section-heading";
import { ServiceCopy } from "../components/service-copy";
import { WebServiceCard } from "../components/web-service-card";

export function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="studio-band studio-services z-1 mt-[calc(12*var(--u))] pt-[calc(192*var(--u))] pb-[calc(47*var(--u))] studio-mobile:pt-18 studio-mobile:pb-16"
    >
      <Wave className="studio-wave-top" />
      <div className="studio-shell relative">
        <SectionHeading
          id="services-title"
          title="خدمات تاکتیک"
          subtitle="از ایده تا اجرا، همه‌چیز برای رشد برند شما."
          description="ما با ترکیب استراتژی، طراحی و فناوری، راهکارهایی خلق می‌کنیم که به کسب‌وکار شما کمک می‌کنند هویتی متمایز بسازد، تجربه‌ای بهتر ارائه دهد و در فضای دیجیتال رشد کند."
        />
        <div className="mt-[calc(72*var(--u))] grid grid-cols-3 gap-[calc(75*var(--u))] studio-mobile:mt-[2.6rem] studio-mobile:gap-[1.3rem] studio-narrow:grid-cols-1">
          <WebServiceCard />
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
            <Portrait className="studio-service-face" />
            <Art
              name="services-ai-stars.webp"
              className="studio-service-stars"
              sizes="180px"
            />
            <ServiceCopy service="ai" />
          </article>
        </div>
        <div className="mt-[calc(72*var(--u))] studio-mobile:mt-6">
          <ConsultationLink />
        </div>
      </div>
    </section>
  );
}
