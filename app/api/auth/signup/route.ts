import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

// Temporary in-memory storage for development
const users = new Map<string, any>()

export async function POST(req: Request) {
  const headers = {
    "Content-Type": "application/json",
  }

  try {
    // Parse request body
    const body = await req.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400, headers })
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400, headers },
      )
    }

    // Check if user exists
    if (users.has(email)) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409, headers })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user object
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    // Store user
    users.set(email, user)

    // Return success without password
    const { password: _, ...safeUser } = user
    return NextResponse.json({ success: true, user: safeUser }, { status: 201, headers })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500, headers })
  }
}

