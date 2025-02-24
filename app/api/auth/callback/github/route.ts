import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect("/login?error=no_code")
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.access_token) {
      // Get user data
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })
      const userData = await userResponse.json()

      // Here you would typically:
      // 1. Create a session
      // 2. Set cookies
      // 3. Store user data

      return NextResponse.redirect("/dashboard")
    }

    return NextResponse.redirect("/login?error=token_error")
  } catch (error) {
    return NextResponse.redirect("/login?error=server_error")
  }
}

