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
