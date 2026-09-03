/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INGESTION_API?: string;
  readonly VITE_DECISION_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
