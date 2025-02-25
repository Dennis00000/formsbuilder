import { createServerClient } from "@/lib/supabase-server"
import { getForm, getFormComments, getLikeCount, checkIfLiked } from "@/lib/db"
import { FormInteractions } from "@/components/form-interactions"
import { redirect } from "next/navigation"
// Add proper error handling and loading states
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default async function FormPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Suspense fallback={<LoadingSpinner />}>
          <FormContent formId={params.id} userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  )
}

async function FormContent({ formId, userId }: { formId: string; userId: string }) {
  try {
    const [form, comments, likeCount, isLiked] = await Promise.all([
      getForm(formId),
      getFormComments(formId),
      getLikeCount(formId),
      checkIfLiked(formId, userId),
    ])

    if (!form) {
      throw new Error("Form not found")
    }

    return (
      <>
        <div>
          <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
          {form.description && <p className="text-muted-foreground">{form.description}</p>}
        </div>
        <FormInteractions
          formId={formId}
          userId={userId}
          initialComments={comments}
          initialLikeCount={likeCount}
          initialLiked={isLiked}
        />
      </>
    )
  } catch (error) {
    return <ErrorMessage error={error} />
  }
}

function ErrorMessage({ error }: { error: any }) {
  console.error("Error loading form:", error)
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500">Error loading form</h1>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    </div>
  )
}

