import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { LoginForm } from "./login-form"

export default async function LoginPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect(`/${locale}/dashboard`)
  }

  return <LoginForm />
} 