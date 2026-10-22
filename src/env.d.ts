interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_APP_URL?: string;
  readonly PUBLIC_NOTIFY_ENDPOINT?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '*.svg?raw' {
  const content: string;
  export default content;
}
