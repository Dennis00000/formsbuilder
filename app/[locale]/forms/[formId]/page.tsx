import { createServerClient } from "@/lib/supabase-server"
import { notFound, redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function FormPage({
  params: { locale, formId }
}: {
  params: { locale: string; formId: string }
}) {
  const t = await getTranslations()
  const supabase = createServerClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/login`)
  }

  // Fetch form data
  const { data: form } = await supabase
    .from('forms')
    .select(`
      *,
      user:users(email)
    `)
    .eq('id', formId)
    .single()

  // Check if form exists
  if (!form) {
    notFound()
  }

  // Check if user has permission to view
  if (!form.is_public && form.user_id !== user.id) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader className="space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              asChild
              className="rounded-full -mt-2 -ml-2"
            >
              <a href={`/${locale}/dashboard`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">{t("common.goBack")}</span>
              </a>
            </Button>
            <div className="space-y-2">
              <CardTitle className="text-2xl">{form.title}</CardTitle>
              <CardDescription>{form.description || t("forms.noDescription")}</CardDescription>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t("forms.createdBy", { email: form.user?.email || t("forms.anonymous") })}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {form.questions?.length > 0 ? (
              form.questions.map((question: any, index: number) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">
                    {index + 1}. {question.text}
                  </h3>
                  {question.type === 'text' && (
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder={t("forms.form.placeholder")}
                      disabled
                    />
                  )}
                  {/* Add more question types here if needed */}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t("forms.noQuestions")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 