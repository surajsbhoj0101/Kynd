import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { themes, getThemeById, DEFAULT_THEME_ID, type ThemeDefinition } from "../lib/themes";

const STORAGE_KEY = "kynd-theme";

interface ThemeContextValue {
  /** The currently active theme */
  currentTheme: ThemeDefinition;
  /** All available themes */
  allThemes: ThemeDefinition[];
  /** Switch to a theme by its id */
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Apply a theme's CSS variables directly on the document root.
 * This overrides the @theme defaults in index.css at runtime.
 */
function applyThemeToDOM(theme: ThemeDefinition) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeDefinition>(() => {
    // Read from localStorage on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return getThemeById(stored);
      }
    }
    return getThemeById(DEFAULT_THEME_ID);
  });

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  const setTheme = useCallback((id: string) => {
    const theme = getThemeById(id);
    setCurrentTheme(theme);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  return (
    <ThemeContext.Provider value={{ currentTheme, allThemes: themes, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
