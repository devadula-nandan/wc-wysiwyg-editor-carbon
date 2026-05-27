import type { CarbonTheme } from "../types/app.types.js";

/**
 * Application name
 */
export const APP_NAME = "WYSIWYG Editor" as const;

/**
 * Default theme
 */
export const DEFAULT_THEME: CarbonTheme = "white" as const;

/**
 * Available themes
 */
export const THEMES: readonly CarbonTheme[] = [
  "white",
  "g10",
  "g90",
  "g100",
] as const;

/**
 * Theme labels for UI
 */
export const THEME_LABELS: Record<CarbonTheme, string> = {
  white: "White",
  g10: "Gray 10",
  g90: "Gray 90",
  g100: "Dark",
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  theme: "theme",
  testNumber: "test-number",
} as const;

/**
 * Default settings
 */
export const DEFAULT_SETTINGS = {
  testNumber: 4,
  testNumberMin: 0,
  testNumberMax: 16,
  testNumberStep: 1,
} as const;

/**
 * URL parameter keys
 */
export const URL_PARAMS = {
  tab: "tab",
} as const;

/**
 * Default tab
 */
export const DEFAULT_TAB = "default-example" as const;

/**
 * CSS custom properties
 */
export const CSS_VARS = {
  testNumber: "--test-number",
} as const;

/**
 * Keyboard shortcuts documentation
 */
export const KEYBOARD_SHORTCUTS = [
  { keys: "Ctrl/Cmd + B", action: "Bold" },
  { keys: "Ctrl/Cmd + I", action: "Italic" },
  { keys: "Ctrl/Cmd + U", action: "Underline" },
  { keys: "Ctrl/Cmd + Z", action: "Undo" },
  { keys: "Ctrl/Cmd + Shift + Z", action: "Redo" },
  { keys: "Ctrl/Cmd + K", action: "Insert Link" },
] as const;

/**
 * Editor features list
 */
export const EDITOR_FEATURES = [
  "Rich text formatting",
  "Headings (H1-H3)",
  "Lists (ordered & unordered)",
  "Tables with editing",
  "Images via URL",
  "Links",
  "Code blocks",
  "Text alignment",
  "Blockquotes",
] as const;
