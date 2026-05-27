import type { Editor } from "@tiptap/core";

/**
 * Editor orientation for toolbar layout
 */
export type EditorOrientation = "horizontal" | "vertical";

/**
 * Heading levels supported by the editor
 */
export type HeadingLevel = 1 | 2 | 3;

/**
 * Text alignment options
 */
export type TextAlignment = "left" | "center" | "right" | "justify";

/**
 * Editor content change event detail
 */
export interface EditorContentChangeDetail {
  content: string;
  editor: Editor;
}

/**
 * Link attributes for the editor
 */
export interface LinkAttributes {
  href: string;
  target?: string;
  rel?: string;
}

/**
 * Image attributes for the editor
 */
export interface ImageAttributes {
  src: string;
  alt?: string;
  title?: string;
}

/**
 * Table insertion options
 */
export interface TableOptions {
  rows: number;
  cols: number;
  withHeaderRow: boolean;
}

/**
 * Editor configuration options
 */
export interface EditorConfig {
  content?: string;
  orientation?: EditorOrientation;
  editable?: boolean;
  autofocus?: boolean;
}

/**
 * Modal state interface
 */
export interface ModalState {
  showLinkModal: boolean;
  showImageModal: boolean;
  linkUrl: string;
  imageUrl: string;
}

/**
 * Toolbar button configuration
 */
export interface ToolbarButton {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
}

/**
 * Toolbar group configuration
 */
export interface ToolbarGroup {
  id: string;
  buttons: ToolbarButton[];
}
