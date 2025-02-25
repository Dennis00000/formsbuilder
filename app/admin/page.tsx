import { createServerClient } from "@/lib/supabase-server"
import { adminGetAllUsers } from "@/lib/admin"
import { redirect } from "next/navigation"
import { StatsCards } from "@/components/admin/stats-cards"
import { UserTable } from "@/components/admin/user-table"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function AdminPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

  if (userData?.role !== "admin") {
    redirect("/dashboard")
  }

  const users = await adminGetAllUsers()

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <StatsCards />
      <UserTable initialUsers={users} currentUserId={session.user.id} />
    </div>
  )
}

