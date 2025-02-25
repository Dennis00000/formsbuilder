import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { FormBuilder } from "@/components/form-builder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default async function NewFormPage() {
  const supabase = createServerClient()
  const t = useTranslations("forms")

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("createNew")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FormBuilder userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

