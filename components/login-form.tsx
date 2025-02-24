"use client"

import { signIn } from "next-auth/react"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export function LoginForm() {
  return (
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <ThemeToggle />
        </div>
        <CardDescription className="text-center">Sign in with GitHub to continue</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button variant="outline" className="w-full" onClick={() => signIn("github")}>
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="text-sm text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardFooter>
    </Card>
  )
}

