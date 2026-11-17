"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { faq } from "./copy";

export function FaqGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

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
        const panelHeight = Math.ceil(panel.getBoundingClientRect().height);
        const { paddingBlockStart, paddingBlockEnd } = getComputedStyle(panel);
        const questionHeight =
          heading.getBoundingClientRect().height +
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

  return (
    <div className="studio-faq-grid" ref={gridRef}>
      {faq.map(({ question, answer }, index) => {
        const expanded = index === activeIndex;
        const answerId = "studio-faq-answer-" + index;

        return (
          <div
            className="studio-faq-card"
            data-expanded={expanded}
            key={question}
          >
            <div className="studio-faq-viewport">
              <div className="studio-faq-content">
                <h3>
                  <button
                    type="button"
                    aria-controls={answerId}
                    aria-expanded={expanded}
                    aria-disabled={expanded}
                    onClick={() => setActiveIndex(index)}
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
        );
      })}
    </div>
  );
}
