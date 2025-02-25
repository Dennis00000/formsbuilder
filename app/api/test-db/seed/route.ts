import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Create a test form
    const { data: form, error: formError } = await supabase
      .from("forms")
      .insert([
        {
          title: "Test Survey",
          description: "A sample survey to test the system",
          questions: [
            {
              id: "q1",
              type: "text",
              title: "What's your favorite color?",
            },
            {
              id: "q2",
              type: "choice",
              title: "How often do you exercise?",
              options: ["Daily", "Weekly", "Monthly", "Never"],
            },
          ],
          is_public: true,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (formError) throw formError

    return NextResponse.json({
      success: true,
      message: "Test data created successfully",
      form,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ success: false, error: "Failed to seed database" }, { status: 500 })
  }
}

