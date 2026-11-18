import Image from "next/image";

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
