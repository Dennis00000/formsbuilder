import { redirect } from "next/navigation"
import { Plus } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"
import { getUserForms } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = createServerClient()
  const t = useTranslations("dashboard")

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const forms = await getUserForms(session.user.id)

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("yourForms")}</h1>
        <Button asChild>
          <a href="/forms/new">
            <Plus className="w-4 h-4 mr-2" />
            {t("createForm")}
          </a>
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">{t("noForms")}</h3>
              <p className="text-muted-foreground">{t("createFirstForm")}</p>
              <Button asChild>
                <a href="/forms/new">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("createForm")}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="hover:bg-accent/50 transition-colors">
              <a href={`/forms/${form.id}`}>
                <CardHeader>
                  <CardTitle className="text-xl">{form.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{form.description || t("noDescription")}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("lastEdited", {
                      date: new Date(form.updated_at).toLocaleDateString(),
                    })}
                  </p>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

