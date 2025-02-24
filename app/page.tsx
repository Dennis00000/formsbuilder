import Link from "next/link"
import { Button } from "../../components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="max-w-3xl space-y-6 px-4">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">Form Builder</h1>
        <p className="text-lg text-muted-foreground sm:text-xl">Create and manage forms easily.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

