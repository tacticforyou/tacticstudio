"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { navigation, services } from "./copy";

export function HeaderMenu({
  children,
  chevron,
}: {
  children: ReactNode;
  chevron: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const servicesId = panelId + "-services";
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLLIElement>(null);
  const servicesHovered = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const servicesToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    const servicesMenu = servicesRef.current;
    if ((!open && !servicesOpen) || !menu || !servicesMenu) return;

    const controller = new AbortController();
    const { signal } = controller;

    const dismissOutside = (target: EventTarget | null) => {
      const node = target instanceof Node ? target : null;
      if (!servicesMenu.contains(node)) setServicesOpen(false);
      if (!menu.contains(node)) setOpen(false);
    };

    document.addEventListener(
      "pointerdown",
      (event) => dismissOutside(event.target),
      { signal },
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        if (servicesOpen) {
          setServicesOpen(false);
          servicesToggleRef.current?.focus();
          return;
        }
        setOpen(false);
        toggleRef.current?.focus();
      },
      { signal },
    );
    menu.addEventListener(
      "click",
      (event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("a[href]")
        ) {
          setOpen(false);
          setServicesOpen(false);
        }
      },
      { signal },
    );
    menu.addEventListener(
      "focusout",
      (event) => dismissOutside(event.relatedTarget),
      { signal },
    );

    return () => controller.abort();
  }, [open, servicesOpen]);

  return (
    <div className="contents" ref={menuRef}>
      <button
        className="studio-menu-toggle"
        type="button"
        aria-controls={panelId}
        aria-expanded={open}
        ref={toggleRef}
        onClick={() => {
          setOpen(!open);
          setServicesOpen(false);
        }}
      >
        <span className="studio-menu-icon" aria-hidden="true" />
        منو
      </button>
      <div className="studio-header-links" id={panelId} data-open={open}>
        <nav aria-label="ناوبری اصلی">
          <ul className="flex flex-wrap items-center justify-center gap-[calc(49*var(--u))] studio-condensed:gap-[calc(25*var(--u))] studio-mobile:grid studio-mobile:items-stretch studio-mobile:justify-stretch studio-mobile:gap-0">
            {navigation.map(({ label, href }) =>
              href === "#services" ? (
                <li
                  className="relative"
                  key={href}
                  ref={servicesRef}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    servicesHovered.current = true;
                    setServicesOpen(true);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== "mouse") return;
                    servicesHovered.current = false;
                    if (!event.currentTarget.querySelector(":focus-visible")) {
                      setServicesOpen(false);
                    }
                  }}
                >
                  <button
                    className="studio-nav-link studio-service-toggle"
                    type="button"
                    aria-controls={servicesId}
                    aria-expanded={servicesOpen}
                    ref={servicesToggleRef}
                    onClick={(event) => {
                      setServicesOpen(
                        (event.detail > 0 && servicesHovered.current) ||
                          !servicesOpen,
                      );
                    }}
                  >
                    {chevron}
                    <span className="studio-nav-label">{label}</span>
                  </button>
                  <ul
                    className="studio-service-menu-list"
                    id={servicesId}
                    data-open={servicesOpen}
                    inert={!servicesOpen}
                  >
                    {Object.entries(services).map(([key, { title }]) => (
                      <li key={key}>
                        <a className="studio-nav-link" href={"#service-" + key}>
                          <span className="studio-nav-label">{title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={href}>
                  <a className="studio-nav-link" href={href}>
                    <span className="studio-nav-label">{label}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
        {children}
      </div>
    </div>
  );
}
