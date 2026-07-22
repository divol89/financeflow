export const FLOW_THEME_STORAGE_KEY = "flow-finance-theme";

export type FlowTheme = "light" | "dark";

export function isFlowTheme(value: unknown): value is FlowTheme {
  return value === "light" || value === "dark";
}

export function resolveFlowTheme(
  storedTheme: string | null,
  prefersDark: boolean
): FlowTheme {
  if (isFlowTheme(storedTheme)) return storedTheme;
  return prefersDark ? "dark" : "light";
}

export function getNextFlowTheme(theme: FlowTheme): FlowTheme {
  return theme === "dark" ? "light" : "dark";
}

export const FLOW_THEME_BOOTSTRAP_SCRIPT = `(() => {
  try {
    const stored = window.localStorage.getItem("${FLOW_THEME_STORAGE_KEY}");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.dataset.flowTheme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.flowTheme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();`;
