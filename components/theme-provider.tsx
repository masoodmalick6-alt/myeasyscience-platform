"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("myeasyscience-theme");
    const initial: Theme = stored === "dark" ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    setTheme(current => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      window.localStorage.setItem("myeasyscience-theme", next);
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const context = useContext(ThemeContext);
  if (!context) return null;
  const dark = context.theme === "dark";
  return <button
    type="button"
    onClick={context.toggleTheme}
    aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
    aria-pressed={dark}
    title={`Switch to ${dark ? "light" : "dark"} mode`}
    className="theme-toggle inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition"
  >
    <span aria-hidden="true">{dark ? "☀️" : "🌙"}</span>
    <span className="hidden md:inline">{dark ? "Light mode" : "Dark mode"}</span>
  </button>;
}
