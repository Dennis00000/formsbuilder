import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Check if user is authenticated and is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role
    const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update user role
    const { role } = await request.json()
    const { error } = await supabaseAdmin.from("users").update({ role }).eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}

