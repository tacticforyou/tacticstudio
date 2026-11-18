import { Art } from "./art";

const portraits = [
  {
    name: "team-portrait-right.webp",
    alignment:
      "justify-self-end motion-safe:group-hover/team:translate-x-[22%]",
  },
  { name: "team-portrait-center.webp", alignment: "justify-self-center" },
  {
    name: "team-portrait-left.webp",
    alignment:
      "justify-self-start motion-safe:group-hover/team:-translate-x-[22%]",
  },
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
          className={`col-start-1 row-start-1 aspect-square w-[37.78%] duration-500 ease-out motion-safe:transition-transform ${alignment}`}
          unoptimized
          eager
        />
      ))}
    </div>
  );
}
