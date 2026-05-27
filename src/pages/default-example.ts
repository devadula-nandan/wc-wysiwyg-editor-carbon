import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import "../components/wc-wysiwyg.js";

/**
 * Default example content for the editor
 */
const DEFAULT_CONTENT = `
  <h1>Welcome to the WYSIWYG Editor</h1>
  <p>This is a powerful rich text editor built with <strong>TipTap</strong> and <strong>Carbon Design System</strong>.</p>
  
  <h2>Features</h2>
  <ul>
    <li>Text formatting (bold, italic, underline, strikethrough)</li>
    <li>Headings (H1, H2, H3)</li>
    <li>Lists (ordered and unordered)</li>
    <li>Tables with full editing capabilities</li>
    <li>Images and links</li>
    <li>Code blocks and inline code</li>
    <li>Text alignment</li>
    <li>Blockquotes</li>
  </ul>

  <h2>Try It Out</h2>
  <p>Start editing this content or create your own. All formatting tools are available in the toolbar above.</p>

  <h3>Sample Table</h3>
  <table>
    <thead>
      <tr>
        <th>Feature</th>
        <th>Status</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Text Formatting</td>
        <td>✓</td>
        <td>Bold, italic, underline, and more</td>
      </tr>
      <tr>
        <td>Tables</td>
        <td>✓</td>
        <td>Full table editing support</td>
      </tr>
      <tr>
        <td>Images</td>
        <td>✓</td>
        <td>Insert images via URL</td>
      </tr>
    </tbody>
  </table>

  <blockquote>
    <p>"This editor provides a great user experience with Carbon Design System's beautiful UI components."</p>
  </blockquote>

  <p>You can also add <code>inline code</code> or create code blocks:</p>

  <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
`;

/**
 * Default Example Page Component
 * Demonstrates the WYSIWYG editor with sample content
 */
@customElement("default-example")
export class DefaultExample extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .example-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    wc-wysiwyg {
      flex: 1;
      min-height: 0;
    }
  `;

  @state()
  private editorContent = DEFAULT_CONTENT;

  /**
   * Handle content change from editor
   */
  private handleContentChange(e: CustomEvent): void {
    this.editorContent = e.detail.content;

    // Log content changes for debugging
    if (import.meta.env.DEV) {
      console.log("Content updated:", this.editorContent);
    }
  }

  /**
   * Main render method
   */
  render() {
    return html`
      <div class="example-container">
        <wc-wysiwyg
          .content=${this.editorContent}
          @content-change=${this.handleContentChange}
        ></wc-wysiwyg>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "default-example": DefaultExample;
  }
}
