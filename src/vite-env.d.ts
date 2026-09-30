/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend manzili, masalan https://birid.silently.watch/ */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
