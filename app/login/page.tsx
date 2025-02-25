'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Button 
        onClick={() => signIn('github')}
        size="lg"
      >
        Sign in with GitHub
      </Button>
    </div>
  )
}

