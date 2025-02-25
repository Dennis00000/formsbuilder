import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { adminUpdateUserRole, adminDeleteUser } from "@/lib/admin"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Verify admin session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get update data
    const { role } = await request.json()

    // Prevent self-role change
    if (params.id === session.user.id) {
      return NextResponse.json({ error: "Cannot modify own role" }, { status: 400 })
    }

    await adminUpdateUserRole(params.id, role)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Verify admin session
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Prevent self-deletion
    if (params.id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete own account" }, { status: 400 })
    }

    await adminDeleteUser(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

