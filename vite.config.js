import { defineConfig } from "vite";
import litCss from "vite-plugin-lit-css";

export default defineConfig({
  base: "/wc-wysiwyg-editor-carbon/",
  plugins: [litCss()],
});
