/**
 * Utility functions for DOM manipulation
 */
export class DOMUtils {
  /**
   * Get focusable elements from shadow root
   */
  public static getFocusableElements(
    shadowRoot: ShadowRoot,
    selector: string,
  ): HTMLElement[] {
    return Array.from(shadowRoot.querySelectorAll<HTMLElement>(selector));
  }

  /**
   * Update tab indexes for keyboard navigation
   */
  public static updateTabIndexes(
    elements: HTMLElement[],
    activeIndex: number,
  ): void {
    elements.forEach((el, i) => {
      el.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
    });
  }

  /**
   * Apply styles to shadow DOM element
   */
  public static applyShadowStyles(
    element: HTMLElement,
    styles: Record<string, string>,
  ): void {
    Object.entries(styles).forEach(([property, value]) => {
      element.style.setProperty(property, value);
    });
  }

  /**
   * Remove border from Carbon dropdown
   */
  public static removeDropdownBorder(dropdown: Element): void {
    const listBox = dropdown?.shadowRoot?.querySelector(".cds--list-box");
    if (listBox) {
      (listBox as HTMLElement).style.border = "none";
    }
  }

  /**
   * Override Carbon stack display to flex with wrap
   */
  public static overrideStackDisplay(stackElement: HTMLElement): void {
    if (!stackElement?.shadowRoot) return;

    const stackDiv = stackElement.shadowRoot.querySelector("div");
    if (stackDiv) {
      (stackDiv as HTMLElement).style.display = "flex";
      (stackDiv as HTMLElement).style.flexWrap = "wrap";
    }
  }

  /**
   * Wait for next animation frame
   */
  public static waitForAnimationFrame(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  /**
   * Apply theme to document
   */
  public static applyTheme(theme: string): void {
    document.documentElement.className = `cds-theme-zone-${theme}`;
  }
}
