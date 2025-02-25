"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"

export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        if (session?.user) {
          // Check admin status
          const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()
          setIsAdmin(userData?.role === "admin")
        }

        setLoading(false)

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setUser(session?.user ?? null)
          if (session?.user) {
            const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()
            setIsAdmin(userData?.role === "admin")
          } else {
            setIsAdmin(false)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Auth error:", error)
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="animate-pulse bg-muted h-8 w-32 rounded" />
          <div className="flex items-center gap-4">
            <div className="animate-pulse bg-muted h-8 w-24 rounded" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="text-2xl md:text-3xl font-bold tracking-tight">
          QuizForm
        </a>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <a href="/dashboard">
                <Button variant={pathname === "/dashboard" ? "default" : "ghost"}>Dashboard</Button>
              </a>
              <a href="/forms/new">
                <Button variant={pathname === "/forms/new" ? "default" : "ghost"}>Create Form</Button>
              </a>
              {isAdmin && (
                <a href="/admin">
                  <Button variant={pathname === "/admin" ? "default" : "ghost"}>Admin</Button>
                </a>
              )}
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <a href="/login">
                <Button variant="ghost">Sign In</Button>
              </a>
              <a href="/signup">
                <Button>Sign Up</Button>
              </a>
            </>
          )}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

