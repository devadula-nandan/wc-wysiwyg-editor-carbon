import { LitElement, html, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import type { Editor } from "@tiptap/core";

// Carbon components
import "@carbon/web-components/es/components/stack/index.js";
import "@carbon/web-components/es/components/icon-button/index.js";
import "@carbon/web-components/es/components/dropdown/index.js";
import "@carbon/web-components/es/components/overflow-menu/index.js";
import "@carbon/web-components/es/components/modal/index.js";
import "@carbon/web-components/es/components/text-input/index.js";

// Carbon icons
import Undo from "@carbon/icons/es/undo/16.js";
import Redo from "@carbon/icons/es/redo/16.js";
import TextBold from "@carbon/icons/es/text--bold/16.js";
import TextItalic from "@carbon/icons/es/text--italic/16.js";
import TextUnderline from "@carbon/icons/es/text--underline/16.js";
import TextStrikethrough from "@carbon/icons/es/text--strikethrough/16.js";
import Code from "@carbon/icons/es/code/16.js";
import ListBulleted from "@carbon/icons/es/list--bulleted/16.js";
import ListNumbered from "@carbon/icons/es/list--numbered/16.js";
import TextAlignLeft from "@carbon/icons/es/text--align--left/16.js";
import TextAlignCenter from "@carbon/icons/es/text--align--center/16.js";
import TextAlignRight from "@carbon/icons/es/text--align--right/16.js";
import Quotes from "@carbon/icons/es/quotes/16.js";
import Table16 from "@carbon/icons/es/table/16.js";
import Image16 from "@carbon/icons/es/image/16.js";
import Link16 from "@carbon/icons/es/link/16.js";
import OverflowMenuVertical from "@carbon/icons/es/overflow-menu--vertical/16.js";
import { iconLoader } from "@carbon/web-components/es/globals/internal/icon-loader.js";

// Services and utilities
import { EditorService } from "../services/editor.service.js";
import { DOMUtils } from "../utils/dom.utils.js";
import { URLUtils } from "../utils/url.utils.js";

// Types and constants
import type {
  EditorOrientation,
  HeadingLevel,
  ModalState,
} from "../types/editor.types.js";
import {
  COMPONENT_PREFIX,
  DEFAULT_EDITOR_CONFIG,
  DEFAULT_TABLE_OPTIONS,
  NAVIGATION_KEYS,
  FOCUSABLE_SELECTORS,
  TOOLTIP_CONFIG,
  MODAL_LABELS,
  TOOLBAR_LABELS,
  TABLE_MENU_ITEMS,
} from "../constants/editor.constants.js";

// Styles
import styles from "./wc-wysiwyg.scss?lit";

/**
 * WYSIWYG Editor Web Component
 * A rich text editor built with TipTap and Carbon Design System
 */
@customElement(`${COMPONENT_PREFIX}-wysiwyg`)
export class WcWysiwyg extends LitElement {
  static styles = styles;

  // Public properties
  @property({ type: String })
  content = "";

  @property({ type: String, reflect: true })
  orientation: EditorOrientation =
    DEFAULT_EDITOR_CONFIG.orientation as EditorOrientation;

  // Private state
  @state()
  private modalState: ModalState = {
    showLinkModal: false,
    showImageModal: false,
    linkUrl: "",
    imageUrl: "",
  };

  @query("cds-stack.toolbar")
  private toolbarEl!: HTMLElement;

  // Services
  private editorService = new EditorService();
  private editor: Editor | null = null;

  /**
   * Lifecycle: Component first updated
   */
  async firstUpdated(): Promise<void> {
    this.setAttribute("role", "application");
    this.addEventListener("keydown", this.handleKeydown);
    this.initializeFocusableElements();
    this.initializeEditor();

    await this.updateComplete;
    this.applyCustomStyles();
  }

  /**
   * Lifecycle: Component disconnected
   */
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.editorService.destroy();
    this.removeEventListener("keydown", this.handleKeydown);
  }

  /**
   * Initialize the TipTap editor
   */
  private initializeEditor(): void {
    const editorElement = this.shadowRoot?.querySelector(".editor-content");
    if (!editorElement) {
      console.error("Editor element not found");
      return;
    }

    try {
      this.editor = this.editorService.initialize(
        editorElement as HTMLElement,
        {
          content: this.content,
          orientation: this.orientation,
        },
        this.handleEditorUpdate.bind(this),
        this.handleSelectionUpdate.bind(this),
      );
    } catch (error) {
      console.error("Failed to initialize editor:", error);
    }
  }

  /**
   * Handle editor content updates
   */
  private handleEditorUpdate(editor: Editor): void {
    this.content = editor.getHTML();
    this.dispatchContentChangeEvent();
    this.requestUpdate();
  }

  /**
   * Handle editor selection updates
   */
  private handleSelectionUpdate(): void {
    this.requestUpdate();
  }

  /**
   * Dispatch content change event
   */
  private dispatchContentChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent("content-change", {
        detail: { content: this.content, editor: this.editor },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Apply custom styles to Carbon components
   */
  private async applyCustomStyles(): Promise<void> {
    // Remove dropdown borders
    const dropdowns = this.renderRoot.querySelectorAll("cds-dropdown");
    dropdowns.forEach((dropdown) => DOMUtils.removeDropdownBorder(dropdown));

    // Override toolbar stack display
    if (this.toolbarEl) {
      DOMUtils.overrideStackDisplay(this.toolbarEl);
    }
  }

  /**
   * Initialize focusable elements for keyboard navigation
   */
  private initializeFocusableElements(): void {
    requestAnimationFrame(() => {
      const focusables = this.getFocusableElements();
      DOMUtils.updateTabIndexes(focusables, 0);
    });
  }

  /**
   * Get focusable elements in the component
   */
  private getFocusableElements(): HTMLElement[] {
    return DOMUtils.getFocusableElements(
      this.renderRoot as ShadowRoot,
      FOCUSABLE_SELECTORS,
    );
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeydown = (event: KeyboardEvent): void => {
    if (!NAVIGATION_KEYS.all.includes(event.key as any)) {
      return;
    }

    const elements = this.getFocusableElements();
    const current = elements.findIndex(
      (btn) => btn.getAttribute("tabindex") === "0",
    );

    if (current === -1) {
      return;
    }

    event.preventDefault();
    const horizontal = this.orientation === "horizontal";

    let next = current;
    if (event.key === "ArrowRight" && horizontal) {
      next = (current + 1) % elements.length;
    } else if (event.key === "ArrowLeft" && horizontal) {
      next = (current - 1 + elements.length) % elements.length;
    } else if (event.key === "ArrowDown" && !horizontal) {
      next = (current + 1) % elements.length;
    } else if (event.key === "ArrowUp" && !horizontal) {
      next = (current - 1 + elements.length) % elements.length;
    }

    DOMUtils.updateTabIndexes(elements, next);
    elements[next].focus();
  };

  /**
   * Execute editor command and update UI
   */
  private executeCommand(command: () => void): void {
    command();
    this.requestUpdate();
  }

  /**
   * Check if editor feature is active
   */
  private isActive(name: string, attrs?: Record<string, any>): boolean {
    return this.editorService.isActive(name, attrs);
  }

  // Modal handlers
  private openLinkModal = (): void => {
    const previousUrl = this.editorService.getLinkAttributes()?.href || "";
    this.modalState = {
      ...this.modalState,
      showLinkModal: true,
      linkUrl: previousUrl,
    };
  };

  private closeLinkModal = (): void => {
    this.modalState = {
      ...this.modalState,
      showLinkModal: false,
      linkUrl: "",
    };
  };

  private setLink = (): void => {
    if (!this.modalState.linkUrl) {
      this.editorService.unsetLink();
    } else if (URLUtils.isValidURL(this.modalState.linkUrl)) {
      this.editorService.setLink({ href: this.modalState.linkUrl });
    } else {
      console.warn("Invalid URL provided");
    }
    this.closeLinkModal();
  };

  private unsetLink = (): void => {
    this.editorService.unsetLink();
    this.closeLinkModal();
  };

  private openImageModal = (): void => {
    this.modalState = {
      ...this.modalState,
      showImageModal: true,
    };
  };

  private closeImageModal = (): void => {
    this.modalState = {
      ...this.modalState,
      showImageModal: false,
      imageUrl: "",
    };
  };

  private insertImage = (): void => {
    if (
      this.modalState.imageUrl &&
      URLUtils.isValidURL(this.modalState.imageUrl)
    ) {
      this.editorService.insertImage({ src: this.modalState.imageUrl });
      this.closeImageModal();
    } else {
      console.warn("Invalid image URL provided");
    }
  };

  /**
   * Render toolbar icon button
   */
  private renderIconButton(
    icon: any,
    tooltip: string,
    onClick: () => void,
    isActive = false,
    isDisabled = false,
  ) {
    return html`
      <cds-icon-button
        size="md"
        autoalign
        kind="ghost"
        enter-delay-ms="${TOOLTIP_CONFIG.enterDelayMs}"
        leave-delay-ms="${TOOLTIP_CONFIG.leaveDelayMs}"
        align="${TOOLTIP_CONFIG.align}"
        ?isselected=${isActive}
        ?disabled=${isDisabled}
        @click=${onClick}
      >
        ${iconLoader(icon, { slot: "icon" })}
        <span slot="tooltip-content">${tooltip}</span>
      </cds-icon-button>
    `;
  }

  /**
   * Render undo/redo toolbar group
   */
  private renderUndoRedoGroup() {
    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        ${this.renderIconButton(
          Undo,
          TOOLBAR_LABELS.undo,
          () => this.executeCommand(() => this.editorService.undo()),
          false,
          !this.editorService.canUndo(),
        )}
        ${this.renderIconButton(
          Redo,
          TOOLBAR_LABELS.redo,
          () => this.executeCommand(() => this.editorService.redo()),
          false,
          !this.editorService.canRedo(),
        )}
      </cds-stack>
    `;
  }

  /**
   * Render text formatting toolbar group
   */
  private renderTextFormattingGroup() {
    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        ${this.renderIconButton(
          TextBold,
          TOOLBAR_LABELS.bold,
          () => this.executeCommand(() => this.editorService.toggleBold()),
          this.isActive("bold"),
        )}
        ${this.renderIconButton(
          TextItalic,
          TOOLBAR_LABELS.italic,
          () => this.executeCommand(() => this.editorService.toggleItalic()),
          this.isActive("italic"),
        )}
        ${this.renderIconButton(
          TextUnderline,
          TOOLBAR_LABELS.underline,
          () => this.executeCommand(() => this.editorService.toggleUnderline()),
          this.isActive("underline"),
        )}
        ${this.renderIconButton(
          TextStrikethrough,
          TOOLBAR_LABELS.strikethrough,
          () => this.executeCommand(() => this.editorService.toggleStrike()),
          this.isActive("strike"),
        )}
        ${this.renderIconButton(
          Code,
          TOOLBAR_LABELS.code,
          () => this.executeCommand(() => this.editorService.toggleCode()),
          this.isActive("code"),
        )}
      </cds-stack>
    `;
  }

  /**
   * Render headings dropdown
   */
  private renderHeadingsGroup() {
    const currentValue = this.isActive("heading", { level: 1 })
      ? "h1"
      : this.isActive("heading", { level: 2 })
        ? "h2"
        : this.isActive("heading", { level: 3 })
          ? "h3"
          : "p";

    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        <cds-dropdown
          value=${currentValue}
          @cds-dropdown-selected=${(e: CustomEvent) => {
            const value = e.detail.item.value;
            if (value === "p") {
              this.executeCommand(() => this.editorService.setParagraph());
            } else {
              const level = parseInt(value.replace("h", "")) as HeadingLevel;
              this.executeCommand(() => this.editorService.setHeading(level));
            }
          }}
        >
          <cds-dropdown-item value="p">Paragraph</cds-dropdown-item>
          <cds-dropdown-item value="h1">Heading 1</cds-dropdown-item>
          <cds-dropdown-item value="h2">Heading 2</cds-dropdown-item>
          <cds-dropdown-item value="h3">Heading 3</cds-dropdown-item>
        </cds-dropdown>
      </cds-stack>
    `;
  }

  /**
   * Render lists toolbar group
   */
  private renderListsGroup() {
    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        ${this.renderIconButton(
          ListBulleted,
          TOOLBAR_LABELS.bulletList,
          () =>
            this.executeCommand(() => this.editorService.toggleBulletList()),
          this.isActive("bulletList"),
        )}
        ${this.renderIconButton(
          ListNumbered,
          TOOLBAR_LABELS.numberedList,
          () =>
            this.executeCommand(() => this.editorService.toggleOrderedList()),
          this.isActive("orderedList"),
        )}
      </cds-stack>
    `;
  }

  /**
   * Render alignment toolbar group
   */
  private renderAlignmentGroup() {
    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        ${this.renderIconButton(
          TextAlignLeft,
          TOOLBAR_LABELS.alignLeft,
          () =>
            this.executeCommand(() => this.editorService.setTextAlign("left")),
          this.isActive("textAlign", { textAlign: "left" }),
        )}
        ${this.renderIconButton(
          TextAlignCenter,
          TOOLBAR_LABELS.alignCenter,
          () =>
            this.executeCommand(() =>
              this.editorService.setTextAlign("center"),
            ),
          this.isActive("textAlign", { textAlign: "center" }),
        )}
        ${this.renderIconButton(
          TextAlignRight,
          TOOLBAR_LABELS.alignRight,
          () =>
            this.executeCommand(() => this.editorService.setTextAlign("right")),
          this.isActive("textAlign", { textAlign: "right" }),
        )}
      </cds-stack>
    `;
  }

  /**
   * Render blocks toolbar group
   */
  private renderBlocksGroup() {
    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        ${this.renderIconButton(
          Quotes,
          TOOLBAR_LABELS.blockquote,
          () =>
            this.executeCommand(() => this.editorService.toggleBlockquote()),
          this.isActive("blockquote"),
        )}
        ${this.renderIconButton(
          Code,
          TOOLBAR_LABELS.codeBlock,
          () => this.executeCommand(() => this.editorService.toggleCodeBlock()),
          this.isActive("codeBlock"),
        )}
      </cds-stack>
    `;
  }

  /**
   * Render insert toolbar group
   */
  private renderInsertGroup() {
    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        ${this.renderIconButton(Table16, TOOLBAR_LABELS.insertTable, () =>
          this.executeCommand(() =>
            this.editorService.insertTable(DEFAULT_TABLE_OPTIONS),
          ),
        )}
        ${this.renderIconButton(
          Link16,
          TOOLBAR_LABELS.insertLink,
          this.openLinkModal,
          this.isActive("link"),
        )}
        ${this.renderIconButton(
          Image16,
          TOOLBAR_LABELS.insertImage,
          this.openImageModal,
        )}
      </cds-stack>
    `;
  }

  /**
   * Render table operations menu
   */
  private renderTableOperations() {
    if (!this.isActive("table")) {
      return nothing;
    }

    return html`
      <cds-stack class="toolbar-group" orientation=${this.orientation}>
        <div data-floating-menu-container style="position: relative;">
          <cds-overflow-menu
            autoalign
            enter-delay-ms="${TOOLTIP_CONFIG.enterDelayMs}"
            leave-delay-ms="${TOOLTIP_CONFIG.leaveDelayMs}"
          >
            ${iconLoader(OverflowMenuVertical, {
              class: "cds--overflow-menu__icon",
              slot: "icon",
            })}
            <span slot="tooltip-content">${TOOLBAR_LABELS.tableOptions}</span>
            <cds-overflow-menu-body>
              <cds-overflow-menu-item
                @click=${() =>
                  this.executeCommand(() =>
                    this.editorService.addColumnBefore(),
                  )}
              >
                ${TABLE_MENU_ITEMS.addColumnBefore}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                @click=${() =>
                  this.executeCommand(() =>
                    this.editorService.addColumnAfter(),
                  )}
              >
                ${TABLE_MENU_ITEMS.addColumnAfter}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                @click=${() =>
                  this.executeCommand(() => this.editorService.deleteColumn())}
              >
                ${TABLE_MENU_ITEMS.deleteColumn}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                divider
                @click=${() =>
                  this.executeCommand(() => this.editorService.addRowBefore())}
              >
                ${TABLE_MENU_ITEMS.addRowBefore}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                @click=${() =>
                  this.executeCommand(() => this.editorService.addRowAfter())}
              >
                ${TABLE_MENU_ITEMS.addRowAfter}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                @click=${() =>
                  this.executeCommand(() => this.editorService.deleteRow())}
              >
                ${TABLE_MENU_ITEMS.deleteRow}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                divider
                @click=${() =>
                  this.executeCommand(() =>
                    this.editorService.toggleHeaderRow(),
                  )}
              >
                ${TABLE_MENU_ITEMS.toggleHeaderRow}
              </cds-overflow-menu-item>
              <cds-overflow-menu-item
                divider
                danger
                @click=${() =>
                  this.executeCommand(() => this.editorService.deleteTable())}
              >
                ${TABLE_MENU_ITEMS.deleteTable}
              </cds-overflow-menu-item>
            </cds-overflow-menu-body>
          </cds-overflow-menu>
        </div>
      </cds-stack>
    `;
  }

  /**
   * Render link modal
   */
  private renderLinkModal() {
    if (!this.modalState.showLinkModal) {
      return nothing;
    }

    return html`
      <cds-modal open @cds-modal-closed=${this.closeLinkModal}>
        <cds-modal-header>
          <cds-modal-heading>${MODAL_LABELS.link.title}</cds-modal-heading>
        </cds-modal-header>
        <cds-modal-body>
          <div class="modal-content">
            <cds-text-input
              label="${MODAL_LABELS.link.urlLabel}"
              placeholder="${MODAL_LABELS.link.urlPlaceholder}"
              .value=${this.modalState.linkUrl}
              @input=${(e: InputEvent) => {
                this.modalState = {
                  ...this.modalState,
                  linkUrl: (e.target as HTMLInputElement).value,
                };
              }}
            ></cds-text-input>
          </div>
        </cds-modal-body>
        <cds-modal-footer>
          <cds-button size="md" kind="secondary" @click=${this.unsetLink}>
            ${MODAL_LABELS.link.removeButton}
          </cds-button>
          <cds-button size="md" kind="primary" @click=${this.setLink}>
            ${MODAL_LABELS.link.insertButton}
          </cds-button>
        </cds-modal-footer>
      </cds-modal>
    `;
  }

  /**
   * Render image modal
   */
  private renderImageModal() {
    if (!this.modalState.showImageModal) {
      return nothing;
    }

    return html`
      <cds-modal open @cds-modal-closed=${this.closeImageModal}>
        <cds-modal-header>
          <cds-modal-heading>${MODAL_LABELS.image.title}</cds-modal-heading>
        </cds-modal-header>
        <cds-modal-body>
          <div class="modal-content">
            <cds-text-input
              label="${MODAL_LABELS.image.urlLabel}"
              placeholder="${MODAL_LABELS.image.urlPlaceholder}"
              .value=${this.modalState.imageUrl}
              @input=${(e: InputEvent) => {
                this.modalState = {
                  ...this.modalState,
                  imageUrl: (e.target as HTMLInputElement).value,
                };
              }}
            ></cds-text-input>
          </div>
        </cds-modal-body>
        <cds-modal-footer>
          <cds-button size="md" kind="secondary" @click=${this.closeImageModal}>
            ${MODAL_LABELS.image.cancelButton}
          </cds-button>
          <cds-button size="md" kind="primary" @click=${this.insertImage}>
            ${MODAL_LABELS.image.insertButton}
          </cds-button>
        </cds-modal-footer>
      </cds-modal>
    `;
  }

  /**
   * Main render method
   */
  render() {
    return html`
      <div class="editor-container">
        <cds-stack class="toolbar" orientation=${this.orientation}>
          ${this.renderUndoRedoGroup()} ${this.renderTextFormattingGroup()}
          ${this.renderHeadingsGroup()} ${this.renderListsGroup()}
          ${this.renderAlignmentGroup()} ${this.renderBlocksGroup()}
          ${this.renderInsertGroup()} ${this.renderTableOperations()}
        </cds-stack>

        <div class="editor-content"></div>
      </div>

      ${this.renderLinkModal()} ${this.renderImageModal()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "wc-wysiwyg": WcWysiwyg;
  }
}
