import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) throw new Error(`Missing environment variable: ${key}`)
})

export const adminClient = createClient<Database>(
  requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL,
  requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "x-admin-client": "true",
      },
    },
  },
)

