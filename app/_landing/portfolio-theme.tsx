"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

const PortfolioThemeContext = createContext<{
  color: string | undefined;
  setColor: Dispatch<SetStateAction<string | undefined>>;
  section: HTMLElement | null;
  setSection: Dispatch<SetStateAction<HTMLElement | null>>;
} | null>(null);

export function PortfolioThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<string>();
  const [section, setSection] = useState<HTMLElement | null>(null);
  const value = useMemo(
    () => ({ color, setColor, section, setSection }),
    [color, section],
  );

  return (
    <PortfolioThemeContext value={value}>{children}</PortfolioThemeContext>
  );
}

export function usePortfolioTheme() {
  const theme = useContext(PortfolioThemeContext);
  if (!theme) {
    throw new Error("usePortfolioTheme requires PortfolioThemeProvider");
  }
  return theme;
}
