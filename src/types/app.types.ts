/**
 * Carbon Design System theme options
 */
export type CarbonTheme = "white" | "g10" | "g90" | "g100";

/**
 * Application tab configuration
 */
export interface TabConfig {
  id: string;
  label: string;
  value: string;
  target: string;
}

/**
 * Application state interface
 */
export interface AppState {
  controlsVisible: boolean;
  currentTab: string;
  theme: CarbonTheme;
}

/**
 * Control panel settings
 */
export interface ControlPanelSettings {
  theme: CarbonTheme;
  testNumber: number;
}

/**
 * URL parameters interface
 */
export interface URLParams {
  tab?: string;
}
