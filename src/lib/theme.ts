export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "nuslat_theme_mode";

export function normalizeThemeMode(mode: string | null | undefined): ThemeMode {
  return mode === "dark" ? "dark" : "light";
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    return normalizeThemeMode(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "light";
  }
}

export function persistThemeMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Ignore localStorage failures.
  }
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode;
}
