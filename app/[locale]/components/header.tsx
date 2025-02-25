'use client'

import { useTranslations } from "next-intl"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { LanguageSwitcher } from "./language-switcher"

export function Header({ locale }: { locale: string }) {
  const t = useTranslations()
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      await supabase.auth.signOut()
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
      })

      // Clear storage
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to home page with locale
      window.location.href = `/${locale}`
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        variant: "destructive",
        title: t("auth.error.title"),
        description: t("auth.error.signOut"),
      })
    }
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <a href={`/${locale}`} className="text-xl font-bold">
          FormBuilder
        </a>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <a href={`/${locale}/dashboard`}>{t("nav.dashboard")}</a>
              </Button>
              <Button asChild variant="ghost">
                <a href={`/${locale}/forms/new`}>{t("nav.createForm")}</a>
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
              >
                {t("auth.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <a href={`/${locale}/login`}>{t("home.signIn")}</a>
              </Button>
            </>
          )}
          <LanguageSwitcher locale={locale} />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
} 