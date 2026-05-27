declare module "*.scss?lit" {
  import { CSSResult } from "lit";
  const styles: CSSResult;
  export default styles;
}

declare module "*.scss" {
  const content: string;
  export default content;
}
