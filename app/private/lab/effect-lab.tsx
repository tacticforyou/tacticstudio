"use client";

import Image from "next/image";
import { useState } from "react";
import { EffectPreview } from "./effect-preview";
import { effects } from "./effects";

export function EffectLab() {
  const [chosen, setChosen] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {effects.map((effect, mode) => {
          const active = chosen === mode;
          return (
            <article
              key={effect.id}
              className="rounded-[1.25rem] border border-studio-ink/12 bg-[#f9f9f4] p-2.5"
              aria-labelledby={`option-${mode}`}
            >
              <div
                className={`relative flex aspect-2/1 items-center justify-center overflow-hidden rounded-xl ${effect.ground}`}
              >
                <EffectPreview mode={mode} />
                <Image
                  src="/images/landing/wordmark-hero.svg"
                  width={260}
                  height={79}
                  alt=""
                  className="pointer-events-none relative h-auto w-[31%] select-none"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-2 pt-3 pb-1">
                <h2
                  id={`option-${mode}`}
                  className="flex items-baseline gap-2 text-lg font-bold"
                >
                  {effect.name}
                  <span
                    lang="en"
                    dir="ltr"
                    className="font-sans text-xs font-normal text-muted"
                  >
                    {effect.english}
                  </span>
                </h2>
                <button
                  type="button"
                  aria-pressed={active}
                  aria-label={`انتخاب ${effect.name}`}
                  onClick={() => setChosen(mode)}
                  className="cursor-pointer rounded-full border border-studio-ink/20 px-3 py-1.5 text-xs font-semibold hover:bg-[#e9ebde] aria-pressed:border-studio-ink aria-pressed:bg-studio-ink aria-pressed:text-white"
                >
                  {active ? "انتخاب شد" : "انتخاب"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <output className="mt-4 block min-h-6 text-sm text-muted">
        {chosen !== null ? `انتخاب شما: ${effects[chosen].name}` : ""}
      </output>
    </>
  );
}
