import Image, { type StaticImageData } from "next/image";
import heroAi from "@/public/images/landing/hero-ai-art.webp";
import webBackground from "@/public/images/landing/services-web-background.webp";
import portraitRight from "@/public/images/landing/shared-portrait-right.webp";
import portrait from "@/public/images/landing/shared-portrait.webp";
import webPhone from "@/public/images/landing/shared-web-phone.webp";
import teamCenter from "@/public/images/landing/team-portrait-center.webp";
import teamLeft from "@/public/images/landing/team-portrait-left.webp";
import teamRight from "@/public/images/landing/team-portrait-right.webp";
import yearsStars from "@/public/images/landing/years-stars.webp";

const rasterArtwork: Readonly<Partial<Record<string, StaticImageData>>> = {
  "hero-ai-art.webp": heroAi,
  "services-web-background.webp": webBackground,
  "shared-portrait-right.webp": portraitRight,
  "shared-portrait.webp": portrait,
  "shared-web-phone.webp": webPhone,
  "team-portrait-center.webp": teamCenter,
  "team-portrait-left.webp": teamLeft,
  "team-portrait-right.webp": teamRight,
  "years-stars.webp": yearsStars,
};

type ArtProps = {
  name: string;
  className?: string;
  imageClassName?: string;
  alt?: string;
  sizes?: string;
  eager?: boolean;
  unoptimized?: boolean;
};

export function Art({
  name,
  className = "",
  imageClassName = "object-contain",
  alt = "",
  sizes = "30vw",
  eager = false,
  unoptimized = false,
}: ArtProps) {
  const image = rasterArtwork[name];

  return (
    <span className={"studio-art " + className}>
      <Image
        src={image ?? "/images/landing/" + name}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        loading={eager ? "eager" : undefined}
        placeholder={eager && image ? "blur" : "empty"}
        className={imageClassName}
      />
    </span>
  );
}

export function Wave({
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

export function Portrait({
  className,
  eager,
  side = "left",
}: Pick<ArtProps, "className" | "eager"> & { side?: "left" | "right" }) {
  const right = side === "right";

  return (
    <Art
      name={right ? "shared-portrait-right.webp" : "shared-portrait.webp"}
      className={`${right ? "aspect-328/838" : "aspect-1178/1886"} ${className ?? ""}`}
      sizes={
        right
          ? "(max-width: 1305px) 270px, (max-width: 1920px) 21vw, 397px"
          : "(max-width: 526px) 152vw, (max-width: 1305px) 801px, (max-width: 1920px) 62vw, 1178px"
      }
      eager={eager}
    />
  );
}
