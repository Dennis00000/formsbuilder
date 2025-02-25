import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
}

const adminClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export interface AdminUser {
  id: string
  email: string
  role: "admin" | "user"
  created_at: string
  last_sign_in_at: string | null
  forms_count: number
}

export interface AdminStats {
  userCount: number
  formCount: number
  responseCount: number
  activeUsers: number
}

export async function adminGetAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await adminClient
    .from("users")
    .select(`
      *,
      forms:forms(count)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data.map((user) => ({
    ...user,
    forms_count: user.forms?.[0]?.count ?? 0,
  }))
}

export async function adminUpdateUserRole(userId: string, role: "admin" | "user"): Promise<void> {
  const { error } = await adminClient.from("users").update({ role }).eq("id", userId)

  if (error) throw error
}

export async function adminDeleteUser(userId: string): Promise<void> {
  const { error: dataError } = await adminClient.from("users").delete().eq("id", userId)

  if (dataError) throw dataError

  const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

  if (authError) throw authError
}

export async function adminGetSystemStats(): Promise<AdminStats> {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [{ count: userCount = 0 }, { count: formCount = 0 }, { count: responseCount = 0 }, { count: activeUsers = 0 }] =
    await Promise.all([
      adminClient.from("users").select("*", { count: "exact", head: true }),
      adminClient.from("forms").select("*", { count: "exact", head: true }),
      adminClient.from("responses").select("*", { count: "exact", head: true }),
      adminClient
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("last_sign_in_at", oneDayAgo.toISOString()),
    ])

  return {
    userCount,
    formCount,
    responseCount,
    activeUsers,
  }
}

