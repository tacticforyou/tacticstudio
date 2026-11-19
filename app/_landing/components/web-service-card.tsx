import { Art } from "./art";
import { ServiceCopy } from "./service-copy";

export function WebServiceCard({ hero = false }: { hero?: boolean }) {
  return (
    <article
      id={hero ? undefined : "service-web"}
      className={
        hero
          ? "studio-hero-card studio-hero-web studio-phone grid min-w-0 grid-cols-1 overflow-hidden studio-tablet:[grid-area:web]"
          : "studio-service-card studio-service-web studio-phone grid min-w-0 grid-cols-1"
      }
    >
      <div
        aria-hidden="true"
        className={
          hero
            ? "[container-type:size] pointer-events-none absolute inset-0 -z-1 grid place-items-center studio-compact:top-auto studio-compact:aspect-326/361"
            : "pointer-events-none absolute inset-0 -z-1"
        }
      >
        <div
          className={hero ? "studio-hero-web-pattern" : "relative size-full"}
        >
          <Art
            name="services-web-background.webp"
            className={
              hero ? "studio-hero-web-pattern-art" : "absolute inset-0"
            }
            sizes={
              (hero
                ? "(min-width: 600px) and (max-width: 960px) min(37vw, 288px), "
                : "") +
              "(max-width: 700px) max(min(calc(100vw - 3rem), 352px), calc(57.4vw - 1.9rem)), (max-width: 760px) calc(57.4vw - 1.9rem), (max-width: 1305px) 255px, (max-width: 1920px) 19.5vw, 374px"
            }
            eager={hero}
          />
        </div>
      </div>
      <ServiceCopy service="web" />
      <div
        className="pointer-events-none relative -z-1 row-start-3"
        aria-hidden="true"
      >
        <Art
          name="shared-web-phone.webp"
          className="studio-phone-art"
          sizes={
            (hero
              ? "(min-width: 600px) and (max-width: 960px) min(50vw, 390px), "
              : "") +
            "(max-width: 700px) max(calc(78vw - 2.6rem), min(calc(136vw - 4rem), 478px)), (max-width: 760px) calc(78vw - 2.6rem), (max-width: 1305px) 346px, (max-width: 1920px) 26.5vw, 508px"
          }
          eager={hero}
        />
      </div>
    </article>
  );
}
