import { SectionHeading } from "../components/section-heading";
import { FaqGrid } from "../faq-grid";

export function Faq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="studio-shell studio-faq relative z-1 pt-[calc(153*var(--u))] pb-[calc(44*var(--u))] studio-mobile:pt-18 studio-mobile:pb-16 studio-tablet:grid studio-tablet:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] studio-tablet:items-start studio-tablet:gap-8 studio-tablet:pb-24"
    >
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
