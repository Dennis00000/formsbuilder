import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Create Amazing Forms
              <span className="text-primary"> In Minutes</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Build beautiful forms, surveys, and quizzes with our easy-to-use form builder. Share with your audience
              and collect responses in real-time.
            </p>
            <div className="space-x-4">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Sign In
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

