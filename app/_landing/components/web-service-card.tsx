import { Art } from "./art";
import { ServiceCopy } from "./service-copy";

export function WebServiceCard({ hero = false }: { hero?: boolean }) {
  return (
    <article
      id={hero ? undefined : "service-web"}
      className={
        hero
          ? "studio-hero-card studio-hero-web studio-phone grid min-w-0 grid-cols-1 overflow-hidden"
          : "studio-service-card studio-service-web studio-phone grid min-w-0 grid-cols-1"
      }
    >
      <Art
        name={
          hero ? "hero-web-background.webp" : "services-web-background.webp"
        }
        className={
          hero
            ? "pointer-events-none absolute inset-0 -z-1 studio-compact:top-auto studio-compact:aspect-326/361"
            : "studio-card-art pointer-events-none"
        }
        sizes={
          hero
            ? "(max-width: 760px) 50vw, 25vw"
            : "(max-width: 700px) 352px, 20vw"
        }
        eager={hero}
      />
      <ServiceCopy service="web" />
      <div
        className="pointer-events-none relative -z-1 row-start-3"
        aria-hidden="true"
      >
        <Art
          name="hero-web-phone.webp"
          className="studio-phone-art"
          sizes={
            hero
              ? "(max-width: 760px) 75vw, (max-width: 1305px) 345px, (max-width: 1920px) 26vw, 507px"
              : "(max-width: 700px) min(136vw, 478px), (max-width: 1305px) 345px, (max-width: 1920px) 27vw, 507px"
          }
          eager={hero}
        />
      </div>
    </article>
  );
}
