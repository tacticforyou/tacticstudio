"use client";

import { useState } from "react";
import { faq } from "./copy";

export function FaqGrid() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="studio-faq-grid">
      {faq.map(({ question, answer }, index) => {
        const expanded = index === activeIndex;
        const answerId = "studio-faq-answer-" + index;

        return (
          <div
            className="studio-faq-card"
            data-expanded={expanded}
            key={question}
          >
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
            <p id={answerId} hidden={!expanded}>
              {answer}
            </p>
            <span
              className="studio-card-wave"
              data-tone={expanded ? "rose" : undefined}
              aria-hidden="true"
            />
          </div>
        );
      })}
    </div>
  );
}
