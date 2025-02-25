"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      if (data?.user) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Enter your email and password to sign in to your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {error && <div className="text-sm text-red-500 text-center">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

