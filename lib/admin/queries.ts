import { adminClient } from "./client"
import type { AdminStats, AdminUser, AuditLog } from "./types"

export async function adminGetAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await adminClient
    .from("users")
    .select(`
      *,
      forms:forms(count),
      responses:responses(count),
      storage:storage_usage(size)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error(`Failed to fetch users: ${error.message}`)
  }

  return data.map((user) => ({
    ...user,
    forms_count: user.forms?.[0]?.count ?? 0,
    responses_count: user.responses?.[0]?.count ?? 0,
    storage_used: user.storage?.[0]?.size ?? 0,
  }))
}

export async function adminGetSystemStats(): Promise<AdminStats> {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const [
    { count: userCount = 0 },
    { count: formCount = 0 },
    { count: responseCount = 0 },
    { count: activeUsers = 0 },
    { data: storageData },
  ] = await Promise.all([
    adminClient.from("users").select("*", { count: "exact", head: true }),
    adminClient.from("forms").select("*", { count: "exact", head: true }),
    adminClient.from("responses").select("*", { count: "exact", head: true }),
    adminClient
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("last_sign_in_at", oneDayAgo.toISOString()),
    adminClient.from("storage_usage").select("size").order("updated_at", { ascending: false }).limit(1).single(),
  ])

  return {
    userCount,
    formCount,
    responseCount,
    activeUsers,
    totalStorage: storageData?.size ?? 0,
  }
}

export async function adminGetAuditLogs(limit = 50, offset = 0): Promise<{ logs: AuditLog[]; total: number }> {
  const { data, error, count } = await adminClient
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching audit logs:", error)
    throw new Error(`Failed to fetch audit logs: ${error.message}`)
  }

  return {
    logs: data,
    total: count ?? 0,
  }
}

export async function adminUpdateUserRole(userId: string, role: AdminUser["role"]): Promise<void> {
  if (!userId || !role) {
    throw new Error("Missing required parameters")
  }

  const { error } = await adminClient
    .from("users")
    .update({
      role,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user role:", error)
    throw new Error(`Failed to update user role: ${error.message}`)
  }
}

export async function adminDeleteUser(userId: string): Promise<void> {
  if (!userId) {
    throw new Error("Missing user ID")
  }

  // Begin transaction
  const { error: txError } = await adminClient.rpc("begin_transaction")
  if (txError) throw txError

  try {
    // Delete storage
    const { error: storageError } = await adminClient.storage.from("forms").remove([`user_${userId}/*`])

    if (storageError) {
      throw storageError
    }

    // Delete user data
    const { error: dataError } = await adminClient.from("users").delete().eq("id", userId)

    if (dataError) {
      throw dataError
    }

    // Delete auth user
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) {
      throw authError
    }

    // Commit transaction
    await adminClient.rpc("commit_transaction")
  } catch (error) {
    // Rollback on error
    await adminClient.rpc("rollback_transaction")
    console.error("Error deleting user:", error)
    throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

