import { createServerClient } from "@/lib/supabase-server"
import { notFound, redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { FormEditor } from "./form-editor"

export default async function EditFormPage({
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
    .select('*')
    .eq('id', formId)
    .single()

  // Check if form exists and user has permission
  if (!form || form.user_id !== user.id) {
    notFound()
  }

  return <FormEditor form={form} />
} 