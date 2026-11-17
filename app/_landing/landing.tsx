import { LandingClickSounds } from "./landing-click-sounds";
import { SectionEdgeAlignment } from "./section-edge-alignment";
import { Approach } from "./sections/approach";
import { Faq } from "./sections/faq";
import { Footer } from "./sections/footer";
import { Hero } from "./sections/hero";
import { Portfolio } from "./sections/portfolio";
import { Services } from "./sections/services";
import { Testimonials } from "./sections/testimonials";
import "./landing.css";

export function LandingPage() {
  return (
    <div
      className="studio-landing overflow-clip bg-studio-white pt-[calc(12*var(--u))] pb-[calc(14*var(--u))] font-studio-body leading-normal text-studio-ink"
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
      <LandingClickSounds />
      <SectionEdgeAlignment />
    </div>
  );
}
