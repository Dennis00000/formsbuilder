'use client'

import { useTranslations } from "next-intl"
import { Heart, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import type { Database } from "@/types/supabase"

type Form = Database['public']['Tables']['forms']['Row'] & {
  user: { email: string } | null
  likes: { count: number }[]
  comments: { count: number }[]
}

interface PublicFormsProps {
  forms: Form[] | null
  locale: string
}

export function PublicForms({ forms, locale }: PublicFormsProps) {
  const t = useTranslations()

  if (!forms?.length) {
    return (
      <div className="text-center text-muted-foreground">
        {t("home.noPublicForms")}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <Card key={form.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">{form.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {form.description || t("dashboard.noDescription")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("home.createdBy", { email: form.user?.email })}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between mt-auto">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{form.likes[0]?.count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{form.comments[0]?.count || 0}</span>
              </div>
            </div>
            <a
              href={`/${locale}/forms/${form.id}`}
              className="text-sm text-primary hover:underline"
            >
              {t("home.viewForm")}
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 