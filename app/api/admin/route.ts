import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client for the API route
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authorization.replace("Bearer ", ""))

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: roleError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (roleError || userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get stats
    const [
      { count: userCount = 0 },
      { count: formCount = 0 },
      { count: responseCount = 0 },
      { count: activeUsers = 0 },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("forms").select("*", { count: "exact", head: true }),
      supabase.from("responses").select("*", { count: "exact", head: true }),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("last_sign_in_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    ])

    return NextResponse.json({
      userCount,
      formCount,
      responseCount,
      activeUsers,
    })
  } catch (error) {
    console.error("Admin API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

