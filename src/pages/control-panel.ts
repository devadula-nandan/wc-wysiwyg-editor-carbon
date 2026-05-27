import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

// Services and utilities
import { StorageService } from "../services/storage.service.js";
import { DOMUtils } from "../utils/dom.utils.js";

// Types and constants
import type { CarbonTheme, ControlPanelSettings } from "../types/app.types.js";
import {
  APP_NAME,
  THEMES,
  THEME_LABELS,
  DEFAULT_SETTINGS,
  KEYBOARD_SHORTCUTS,
  EDITOR_FEATURES,
  CSS_VARS,
} from "../constants/app.constants.js";

/**
 * Control Panel Component
 * Provides settings and information about the editor
 */
@customElement("control-panel")
export class ControlPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      box-sizing: border-box;
    }

    .section {
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--cds-text-secondary);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-text {
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
      margin-top: 0.5rem;
      line-height: 1.4;
    }

    .info-list {
      font-size: 0.875rem;
      color: var(--cds-text-secondary);
      line-height: 1.4;
      padding-left: 1.25rem;
      margin: 0.5rem 0;
    }

    .shortcut-item {
      margin-bottom: 0.5rem;
    }

    .shortcut-keys {
      font-weight: 600;
      color: var(--cds-text-primary);
    }
  `;

  @state()
  private settings: ControlPanelSettings = {
    testNumber: DEFAULT_SETTINGS.testNumber,
    theme: "white",
  };

  /**
   * Lifecycle: Component connected
   */
  connectedCallback(): void {
    super.connectedCallback();
    this.loadSettings();
    this.applySettings();
  }

  /**
   * Load settings from storage
   */
  private loadSettings(): void {
    this.settings = {
      testNumber: StorageService.getTestNumber(),
      theme: StorageService.getTheme(),
    };
  }

  /**
   * Apply settings to the application
   */
  private applySettings(): void {
    const app = document.querySelector("app-root");

    // Apply test number CSS variable
    app?.style.setProperty(
      CSS_VARS.testNumber,
      `${this.settings.testNumber}px`,
    );
    StorageService.setTestNumber(this.settings.testNumber);

    // Apply theme
    DOMUtils.applyTheme(this.settings.theme);
    StorageService.setTheme(this.settings.theme);
  }

  /**
   * Handle theme change
   */
  private handleThemeChange(e: CustomEvent): void {
    this.settings = {
      ...this.settings,
      theme: e.detail.item.value as CarbonTheme,
    };
    this.applySettings();
  }

  /**
   * Handle test number change
   */
  private handleTestNumberChange(e: CustomEvent): void {
    const target = e.target as HTMLInputElement;
    if (!target) return;

    const value = Number(target.value);
    if (!isNaN(value)) {
      this.settings = {
        ...this.settings,
        testNumber: value,
      };
      this.applySettings();
    }
  }

  /**
   * Reset settings to defaults
   */
  private resetSettings(): void {
    this.settings = {
      testNumber: DEFAULT_SETTINGS.testNumber,
      theme: "white",
    };
    this.applySettings();
    this.requestUpdate();
  }

  /**
   * Render theme dropdown
   */
  private renderThemeSection() {
    return html`
      <div class="section">
        <div class="section-title">Appearance</div>
        <cds-dropdown
          label="Theme"
          .value=${this.settings.theme}
          @cds-dropdown-selected=${this.handleThemeChange}
        >
          ${THEMES.map(
            (theme) => html`
              <cds-dropdown-item value="${theme}">
                ${THEME_LABELS[theme]}
              </cds-dropdown-item>
            `,
          )}
        </cds-dropdown>
      </div>
    `;
  }

  /**
   * Render editor features section
   */
  private renderFeaturesSection() {
    return html`
      <div class="section">
        <div class="section-title">Editor Features</div>
        <p class="info-text">The editor includes:</p>
        <ul class="info-list">
          ${EDITOR_FEATURES.map((feature) => html`<li>${feature}</li>`)}
        </ul>
      </div>
    `;
  }

  /**
   * Render keyboard shortcuts section
   */
  private renderShortcutsSection() {
    return html`
      <div class="section">
        <div class="section-title">Keyboard Shortcuts</div>
        ${KEYBOARD_SHORTCUTS.map(
          (shortcut) => html`
            <p class="info-text shortcut-item">
              <span class="shortcut-keys">${shortcut.keys}:</span>
              ${shortcut.action}
            </p>
          `,
        )}
      </div>
    `;
  }

  /**
   * Render table editing section
   */
  private renderTableEditingSection() {
    return html`
      <div class="section">
        <div class="section-title">Table Editing</div>
        <p class="info-text">
          When your cursor is in a table, additional toolbar buttons appear to:
        </p>
        <ul class="info-list">
          <li>Add/delete rows and columns</li>
          <li>Toggle header row</li>
          <li>Delete entire table</li>
        </ul>
      </div>
    `;
  }

  /**
   * Render demo settings section
   */
  private renderDemoSettingsSection() {
    return html`
      <div class="section">
        <div class="section-title">Demo Settings</div>
        <cds-number-input
          label="${CSS_VARS.testNumber}"
          min="${DEFAULT_SETTINGS.testNumberMin}"
          max="${DEFAULT_SETTINGS.testNumberMax}"
          step="${DEFAULT_SETTINGS.testNumberStep}"
          invalid-text="Value must be between ${DEFAULT_SETTINGS.testNumberMin} and ${DEFAULT_SETTINGS.testNumberMax}"
          .value=${String(this.settings.testNumber)}
          @cds-number-input=${this.handleTestNumberChange}
        ></cds-number-input>
      </div>
    `;
  }

  /**
   * Main render method
   */
  render() {
    return html`
      <cds-layer level="1">
        <cds-stack gap="7">
          <cds-heading>${APP_NAME}</cds-heading>

          ${this.renderThemeSection()} ${this.renderFeaturesSection()}
          ${this.renderShortcutsSection()} ${this.renderTableEditingSection()}
          ${this.renderDemoSettingsSection()}

          <cds-button kind="danger" @click=${this.resetSettings}>
            Reset Settings
          </cds-button>
        </cds-stack>
      </cds-layer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "control-panel": ControlPanel;
  }
}
