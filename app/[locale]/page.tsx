import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { useTranslations } from "next-intl"

export default async function HomePage() {
  const t = useTranslations("home")
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
              {t("title")}
              <span className="text-primary"> {t("subtitle")}</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              {t("description")}
            </p>
            <div className="space-x-4">
              <a
                href={`/${t("locale")}/signup`}
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {t("getStarted")}
              </a>
              <a
                href={`/${t("locale")}/login`}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {t("signIn")}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

