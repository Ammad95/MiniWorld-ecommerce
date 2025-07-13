/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_JAZZCASH_MERCHANT_ID: string
  readonly VITE_JAZZCASH_PASSWORD: string
  readonly VITE_JAZZCASH_INTEGRATION_SALT: string
  readonly VITE_JAZZCASH_RETURN_URL: string
  readonly VITE_JAZZCASH_SANDBOX: string
  readonly VITE_ADMIN_EMAIL: string
  readonly VITE_ADMIN_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 