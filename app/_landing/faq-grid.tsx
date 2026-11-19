"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { faq } from "./copy";
import type { prepareFaqMotion } from "./faq-motion";

const faqHoverLayout = "(width > 960px) and (any-hover: hover)";
const reducedMotion = "(prefers-reduced-motion: reduce)";

export function FaqGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prepareMotion, setPrepareMotion] = useState<
    typeof prepareFaqMotion | null
  >(null);
  const [usesMotion, setUsesMotion] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingMotion = useRef<ReturnType<typeof prepareFaqMotion>>(null);
  const cancelMotion = useRef<() => void>(null);

  useEffect(() => {
    let mounted = true;
    void import("./faq-motion")
      .then(({ prepareFaqMotion }) => {
        if (!mounted) return;
        setPrepareMotion(() => prepareFaqMotion);
      })
      .catch(() => {
        // The CSS transition remains available if the animation chunk fails.
      });

    const preference = window.matchMedia(reducedMotion);
    const stopMotion = () => cancelMotion.current?.();
    preference.addEventListener("change", stopMotion);
    return () => {
      mounted = false;
      preference.removeEventListener("change", stopMotion);
      stopMotion();
    };
  }, []);

  useLayoutEffect(() => {
    const play = pendingMotion.current;
    if (!play) return;

    pendingMotion.current = null;
    cancelMotion.current?.();
    cancelMotion.current = play();
  }, [activeIndex]);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>(".studio-faq-card"),
      (card) => ({
        card,
        panel: card.querySelector<HTMLElement>(".studio-faq-content")!,
        heading: card.querySelector<HTMLElement>("h3")!,
      }),
    );
    grid.style.setProperty("--faq-closed-count", String(cards.length - 1));

    const measureCards = () => {
      let tallestPanel = 0;
      let tallestQuestion = 0;

      for (const { card, panel, heading } of cards) {
        // Computed block sizes stay in layout coordinates while the card animates.
        const { blockSize, paddingBlockStart, paddingBlockEnd } =
          getComputedStyle(panel);
        const panelHeight = Math.ceil(parseFloat(blockSize));
        const questionHeight =
          parseFloat(getComputedStyle(heading).blockSize) +
          parseFloat(paddingBlockStart) +
          parseFloat(paddingBlockEnd);

        card.style.setProperty("--faq-open-height", panelHeight + "px");
        tallestPanel = Math.max(tallestPanel, panelHeight);
        tallestQuestion = Math.max(tallestQuestion, questionHeight);
      }

      grid.style.setProperty("--faq-reserved-height", tallestPanel + "px");
      grid.style.setProperty(
        "--faq-question-height",
        Math.ceil(tallestQuestion) + "px",
      );
    };

    measureCards();
    const observer = new ResizeObserver(measureCards);
    for (const { panel, heading } of cards) {
      observer.observe(panel);
      observer.observe(heading);
    }
    return () => observer.disconnect();
  }, []);

  function selectCard(index: number) {
    if (index === activeIndex) return;

    const grid = gridRef.current;
    if (grid && prepareMotion && !window.matchMedia(reducedMotion).matches) {
      pendingMotion.current = prepareMotion(grid);
      setUsesMotion(true);
    }
    setActiveIndex(index);
  }

  return (
    <div
      className="studio-faq-grid isolate mt-[calc(26*var(--u))] grid grid-cols-4 items-start gap-(--faq-gap) studio-faq-stack:mt-[1.65rem] studio-faq-stack:grid-cols-1 studio-faq-stack:content-start studio-tablet:mt-0 studio-tablet:grid-cols-1 studio-tablet:content-start"
      data-motion-ready={Boolean(prepareMotion)}
      data-motion-layout={usesMotion}
      ref={gridRef}
    >
      {faq.map(({ question, answer }, index) => {
        const expanded = index === activeIndex;
        const answerId = "studio-faq-answer-" + index;

        return (
          <div
            className="studio-faq-card"
            data-expanded={expanded}
            key={question}
          >
            <span className="studio-faq-shadow" aria-hidden="true" />
            <div
              className="studio-faq-surface"
              onPointerEnter={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  window.matchMedia(faqHoverLayout).matches
                ) {
                  selectCard(index);
                }
              }}
            >
              <div className="overflow-clip rounded-[inherit]">
                <div className="studio-faq-content">
                  <h3>
                    <button
                      className="block w-full text-start whitespace-pre-line studio-faq-stack:whitespace-normal studio-tablet:whitespace-normal"
                      type="button"
                      aria-controls={answerId}
                      aria-expanded={expanded}
                      aria-disabled={expanded}
                      onClick={(event) => {
                        if (
                          event.detail === 0 ||
                          !window.matchMedia(faqHoverLayout).matches ||
                          (event.nativeEvent instanceof PointerEvent &&
                            event.nativeEvent.pointerType === "touch")
                        ) {
                          selectCard(index);
                        }
                      }}
                    >
                      {question}
                    </button>
                  </h3>
                  <div
                    className="studio-faq-answer"
                    id={answerId}
                    aria-hidden={!expanded}
                  >
                    <p>{answer}</p>
                  </div>
                </div>
              </div>
              <span className="studio-card-wave" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
