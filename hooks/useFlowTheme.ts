import { useCallback, useEffect, useState } from "react";
import {
  FLOW_THEME_STORAGE_KEY,
  getNextFlowTheme,
  isFlowTheme,
  resolveFlowTheme,
  type FlowTheme,
} from "@/lib/flowFinance/theme";

function applyTheme(theme: FlowTheme) {
  document.documentElement.dataset.flowTheme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#07131f" : "#f4f8fc");
}

export function useFlowTheme() {
  const [theme, setTheme] = useState<FlowTheme>("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(FLOW_THEME_STORAGE_KEY);
    const bootstrappedTheme = document.documentElement.dataset.flowTheme;
    const initialTheme = isFlowTheme(bootstrappedTheme)
      ? bootstrappedTheme
      : resolveFlowTheme(
          storedTheme,
          window.matchMedia("(prefers-color-scheme: dark)").matches
        );

    applyTheme(initialTheme);
    setTheme(initialTheme);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== FLOW_THEME_STORAGE_KEY || !isFlowTheme(event.newValue)) return;
      applyTheme(event.newValue);
      setTheme(event.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = getNextFlowTheme(currentTheme);
      window.localStorage.setItem(FLOW_THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}
