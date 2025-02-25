import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { FormBuilder } from "@/components/form-builder"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function NewFormPage() {
  const supabase = createServerClient()

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
          <CardTitle>Create New Form</CardTitle>
        </CardHeader>
        <CardContent>
          <FormBuilder userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

