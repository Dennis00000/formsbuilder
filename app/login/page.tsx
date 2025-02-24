import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Github } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full py-12 flex items-center justify-center bg-background">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <ThemeToggle />
          </div>
          <CardDescription className="text-center">Sign in with GitHub to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <a
            href="/api/auth/github"
            className="w-full flex items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Github className="h-4 w-4" />
            Continue with GitHub
          </a>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

