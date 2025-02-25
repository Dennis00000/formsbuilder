'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      toast({
        title: t("auth.signup.success.title"),
        description: t("auth.signup.success.description"),
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("auth.signup.error.title"),
        description: error instanceof Error ? error.message : t("auth.signup.error.description"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-6">
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            className="rounded-full -mt-2 -ml-2"
          >
            <a href={`/${locale}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">{t("common.goBack")}</span>
            </a>
          </Button>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{t("auth.signup.title")}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("auth.signup.description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.signup.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.signup.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                t("auth.signup.submit")
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-center text-muted-foreground">
            {t("auth.signup.haveAccount")}{" "}
            <a href={`/${locale}/login`} className="text-primary hover:underline">
              {t("auth.signup.signIn")}
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 