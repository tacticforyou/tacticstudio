"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { QuickAccessButtonArt } from "./components/quick-access-button-art";
import { navigation } from "./copy";
import { usePortfolioTheme } from "./portfolio-theme";

const quickLinks = ["#top", "#work", "#services", "#contact", "#approach"].map(
  (href) => navigation.find((link) => link.href === href)!,
);

export function QuickAccessMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hovered = useRef(false);
  const { color } = usePortfolioTheme();

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const { signal } = controller;
    const desktop = window.matchMedia("(width > 960px)");
    const close = () => setOpen(false);

    document.addEventListener(
      "pointerdown",
      (event) => {
        if (
          event.target instanceof Node &&
          !menuRef.current?.contains(event.target)
        ) {
          close();
        }
      },
      { signal },
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        close();
        toggleRef.current?.focus();
      },
      { signal },
    );
    desktop.addEventListener("change", close, { signal });

    return () => controller.abort();
  }, [open]);

  return (
    <div
      className="studio-quick-access"
      data-open={open}
      data-project-theme={Boolean(color)}
      style={
        color
          ? ({ "--studio-quick-project-color": color } as CSSProperties)
          : undefined
      }
      ref={menuRef}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        hovered.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        hovered.current = false;
        if (!event.currentTarget.querySelector(":focus-visible"))
          setOpen(false);
      }}
      onBlur={(event) => {
        if (
          !hovered.current &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
    >
      <button
        className="studio-quick-access-toggle"
        type="button"
        ref={toggleRef}
        aria-label={open ? "بستن دسترسی سریع" : "باز کردن دسترسی سریع"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(event) => {
          setOpen((event.detail > 0 && hovered.current) || !open);
        }}
      >
        <QuickAccessButtonArt open={open} />
      </button>
      <nav
        className="studio-quick-access-panel"
        id={panelId}
        aria-label="دسترسی سریع"
        inert={!open}
      >
        <ul className="grid">
          {quickLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                className="studio-quick-access-link"
                href={href}
                onClick={() => setOpen(false)}
              >
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          className="studio-quick-access-consultation"
          href="#contact"
          onClick={() => setOpen(false)}
        >
          مشاوره
        </a>
      </nav>
    </div>
  );
}
