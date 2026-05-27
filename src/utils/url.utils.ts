import { URL_PARAMS, DEFAULT_TAB } from "../constants/app.constants.js";

/**
 * Utility functions for URL manipulation
 */
export class URLUtils {
  /**
   * Get tab parameter from URL
   */
  public static getTabFromURL(): string {
    const params = new URLSearchParams(window.location.search);
    return params.get(URL_PARAMS.tab) ?? DEFAULT_TAB;
  }

  /**
   * Update URL with tab parameter
   */
  public static updateTabInURL(tab: string): void {
    const params = new URLSearchParams(window.location.search);
    params.set(URL_PARAMS.tab, tab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    history.pushState({}, "", newUrl);
  }

  /**
   * Validate URL format
   */
  public static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate image URL format
   */
  public static isValidImageURL(url: string): boolean {
    if (!this.isValidURL(url)) {
      return false;
    }

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerUrl.includes(ext));
  }
}
