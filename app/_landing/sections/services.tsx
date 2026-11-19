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
        <div className="mt-[calc(72*var(--u))] grid grid-cols-3 gap-[calc(75*var(--u))] max-[600px]:gap-4 studio-mobile:mt-[2.6rem] studio-mobile:gap-[1.3rem] studio-narrow:grid-cols-1 studio-tablet:grid-cols-2 studio-tablet:gap-4 max-[600px]:[&_.studio-service-copy]:absolute max-[600px]:[&_.studio-service-copy]:top-1/2 max-[600px]:[&_.studio-service-copy]:right-[7%] max-[600px]:[&_.studio-service-copy]:bottom-auto max-[600px]:[&_.studio-service-copy]:w-[40%] max-[600px]:[&_.studio-service-copy]:-translate-y-1/2 max-[600px]:[&>.studio-service-card]:m-0 max-[600px]:[&>.studio-service-card]:aspect-auto max-[600px]:[&>.studio-service-card]:min-h-[clamp(10rem,40vw,13rem)] max-[600px]:[&>.studio-service-card]:w-full studio-tablet:[&>.studio-service-card]:m-0 studio-tablet:[&>.studio-service-card]:w-full">
          <WebServiceCard />
          <article
            id="service-brand"
            className="studio-service-card studio-service-brand"
          >
            <Art
              name="services-brand-art.svg"
              className="studio-card-art max-[600px]:right-auto max-[600px]:w-[55%]"
              imageClassName="object-contain max-[600px]:object-cover"
            />
            <ServiceCopy service="brand" />
          </article>
          <article
            id="service-ai"
            className="studio-service-card studio-service-ai studio-tablet:col-span-2 studio-tablet:aspect-auto studio-tablet:min-h-[clamp(12rem,32vw,16rem)] studio-tablet:[&_.studio-service-copy]:top-1/2 studio-tablet:[&_.studio-service-copy]:right-[7%] studio-tablet:[&_.studio-service-copy]:w-[40%] studio-tablet:[&_.studio-service-copy]:-translate-y-1/2"
          >
            <Portrait className="studio-service-face max-[600px]:top-1/2 max-[600px]:-left-[4%] max-[600px]:w-[65%] max-[600px]:-translate-y-[55%] studio-tablet:top-1/2 studio-tablet:-left-[4%] studio-tablet:w-[65%] studio-tablet:-translate-y-[55%]" />
            <Art
              name="services-ai-stars.webp"
              className="studio-service-stars max-[600px]:inset-s-auto max-[600px]:left-[26%] max-[600px]:w-[24%] studio-tablet:inset-s-auto studio-tablet:left-[26%] studio-tablet:w-[24%]"
              sizes="(max-width: 960px) min(24vw, 208px), 180px"
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
