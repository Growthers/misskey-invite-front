/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TOS_URL: string;
  readonly VITE_ADDRESS_REQUEST_FORM_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
