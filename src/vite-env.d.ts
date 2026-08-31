/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module '*.md' {
  import type { GuideModule } from '../plugins/vite-plugin-markdown';
  const guide: GuideModule;
  export default guide;
}
