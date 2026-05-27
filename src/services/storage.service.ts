import type { CarbonTheme } from "../types/app.types.js";
import {
  STORAGE_KEYS,
  DEFAULT_THEME,
  DEFAULT_SETTINGS,
} from "../constants/app.constants.js";

/**
 * Service class for managing local storage operations
 */
export class StorageService {
  /**
   * Get theme from storage or use default
   */
  public static getTheme(): CarbonTheme {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    if (stored && this.isValidTheme(stored)) {
      return stored as CarbonTheme;
    }

    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDark ? "g100" : DEFAULT_THEME;
  }

  /**
   * Set theme in storage
   */
  public static setTheme(theme: CarbonTheme): void {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }

  /**
   * Get test number from storage or use default
   */
  public static getTestNumber(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.testNumber);
    const value = stored ? Number(stored) : DEFAULT_SETTINGS.testNumber;
    return isNaN(value) ? DEFAULT_SETTINGS.testNumber : value;
  }

  /**
   * Set test number in storage
   */
  public static setTestNumber(value: number): void {
    localStorage.setItem(STORAGE_KEYS.testNumber, String(value));
  }

  /**
   * Clear all storage
   */
  public static clear(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Validate if string is a valid theme
   */
  private static isValidTheme(value: string): boolean {
    return ["white", "g10", "g90", "g100"].includes(value);
  }
}
