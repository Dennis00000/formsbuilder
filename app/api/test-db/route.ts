import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Test database connection by checking tables
    const { data: tables, error: tablesError } = await supabase.from("forms").select("count")

    if (tablesError) {
      throw tablesError
    }

    // Get current user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      tables: {
        forms: tables,
      },
      session: session
        ? {
            user: {
              id: session.user.id,
              email: session.user.email,
            },
          }
        : null,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to connect to database",
      },
      { status: 500 },
    )
  }
}

