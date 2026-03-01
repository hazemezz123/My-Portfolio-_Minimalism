"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  mounted: boolean;
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyThemeClass(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;

  root.classList.add("theme-changing");
  root.classList.toggle("dark", resolvedTheme === "dark");

  requestAnimationFrame(() => {
    root.classList.remove("theme-changing");
  });
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme: Theme =
      storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
        ? storedTheme
        : "system";

    const nextResolvedTheme = resolveTheme(initialTheme);

    setThemeState(initialTheme);
    setResolvedTheme(nextResolvedTheme);
    applyThemeClass(nextResolvedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleChange = () => {
      const next = mediaQuery.matches ? "dark" : "light";
      setResolvedTheme(next);
      applyThemeClass(next);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mounted, theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    const nextResolvedTheme = resolveTheme(nextTheme);

    setThemeState(nextTheme);
    setResolvedTheme(nextResolvedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyThemeClass(nextResolvedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const current = resolveTheme(theme);
    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mounted,
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [mounted, resolvedTheme, setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
