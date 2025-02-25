import { supabase } from "./supabase"

export type UserRole = "admin" | "user"

export async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase.from("users").select("role").eq("id", userId).single()

  if (error) throw error
  return (data?.role as UserRole) ?? "user"
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === "admin"
}

// This function should only be called from admin-protected API routes
export async function updateUserRole(userId: string, role: UserRole) {
  const { error } = await supabase.from("users").update({ role }).eq("id", userId)

  if (error) throw error
}

