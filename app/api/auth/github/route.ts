import { redirect } from "next/navigation"

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/github`

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`

  redirect(githubAuthUrl)
}

