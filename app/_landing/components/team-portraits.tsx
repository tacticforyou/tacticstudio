import { Art } from "./art";

const portraits = [
  { name: "team-portrait-right.webp", alignment: "justify-self-end" },
  { name: "team-portrait-center.webp", alignment: "justify-self-center" },
  { name: "team-portrait-left.webp", alignment: "justify-self-start" },
];

export function TeamPortraits() {
  return (
    <div
      aria-hidden="true"
      dir="ltr"
      className="grid w-[38%] flex-none grid-cols-1 studio-mobile:max-w-36"
    >
      {portraits.map(({ name, alignment }) => (
        <Art
          key={name}
          name={name}
          className={`col-start-1 row-start-1 aspect-square w-[37.78%] ${alignment}`}
          unoptimized
          eager
        />
      ))}
    </div>
  );
}
