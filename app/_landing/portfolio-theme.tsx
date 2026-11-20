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
} | null>(null);

export function PortfolioThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState<string>();
  const value = useMemo(() => ({ color, setColor }), [color]);

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
