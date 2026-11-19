import { Art } from "./art";
import { ServiceCopy } from "./service-copy";

export function WebServiceCard({ hero = false }: { hero?: boolean }) {
  return (
    <article
      id={hero ? undefined : "service-web"}
      className={
        hero
          ? "studio-hero-card studio-hero-web studio-phone grid min-w-0 grid-cols-1 overflow-hidden studio-tablet:[grid-area:web]"
          : "studio-service-card studio-service-web studio-phone grid min-w-0 grid-cols-1 max-[600px]:grid-rows-none max-[600px]:[&>.studio-service-copy]:row-auto"
      }
    >
      <div
        aria-hidden="true"
        className={
          hero
            ? "[container-type:size] pointer-events-none absolute inset-0 -z-1 grid place-items-center studio-compact:top-auto studio-compact:aspect-326/361"
            : "pointer-events-none absolute inset-0 -z-1 max-[600px]:right-auto max-[600px]:w-[55%]"
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
                : "(width < 600px) calc(55vw - 2.2rem), (min-width: 600px) and (max-width: 960px) min(calc(50vw - 2.5rem), 426px), ") +
              "(max-width: 700px) max(min(calc(100vw - 3rem), 352px), calc(57.4vw - 1.9rem)), (max-width: 760px) calc(57.4vw - 1.9rem), (max-width: 1305px) 255px, (max-width: 1920px) 19.5vw, 374px"
            }
            eager={hero}
            imageClassName={
              hero
                ? "object-contain"
                : "object-contain max-[600px]:object-cover"
            }
          />
        </div>
      </div>
      <ServiceCopy service="web" />
      <div
        className={
          hero
            ? "pointer-events-none relative -z-1 row-start-3"
            : "pointer-events-none relative -z-1 row-start-3 max-[600px]:absolute max-[600px]:inset-y-0 max-[600px]:left-0 max-[600px]:row-auto max-[600px]:w-[52%] max-[600px]:overflow-hidden"
        }
        aria-hidden="true"
      >
        <Art
          name="shared-web-phone.webp"
          className={
            hero
              ? "studio-phone-art"
              : "studio-phone-art max-[600px]:top-[18%] max-[600px]:-left-[15%] max-[600px]:mt-0 max-[600px]:w-[150%]"
          }
          sizes={
            (hero
              ? "(min-width: 600px) and (max-width: 960px) min(50vw, 390px), "
              : "(width < 600px) calc(78vw - 3.1rem), (min-width: 600px) and (max-width: 960px) min(calc(68vw - 3.4rem), 577px), ") +
            "(max-width: 700px) max(calc(78vw - 2.6rem), min(calc(136vw - 4rem), 478px)), (max-width: 760px) calc(78vw - 2.6rem), (max-width: 1305px) 346px, (max-width: 1920px) 26.5vw, 508px"
          }
          eager={hero}
        />
      </div>
    </article>
  );
}
