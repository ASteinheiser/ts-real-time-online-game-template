/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_PUBLIC_WEB_BASE_URL: string;
  readonly VITE_DEEP_LINK_PROTOCOL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
