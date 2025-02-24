import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getForm, getUserById } from "@/lib/db"
import { FormResponse } from "@/components/form-response"

export default async function FormPage({
  params,
}: {
  params: { formId: string }
}) {
  const session = await getServerSession(authOptions)
  const form = await getForm(params.formId)

  if (!form) {
    notFound()
  }

  // Get the form creator's information
  const user = await getUserById(form.userId)

  // Add user and counts to the form object to match the expected structure
  const formWithDetails = {
    ...form,
    user: {
      name: user?.name || "Anonymous",
      image: user?.image,
    },
    _count: {
      responses: 0, // You can implement response counting if needed
      comments: 0, // You can implement comment counting if needed
      likes: 0, // You can implement like counting if needed
    },
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{formWithDetails.title}</h1>
        {formWithDetails.description && <p className="text-muted-foreground">{formWithDetails.description}</p>}
        <div className="flex items-center space-x-4 mt-4">
          <div className="text-sm text-muted-foreground">Created by {formWithDetails.user.name}</div>
          <div className="text-sm text-muted-foreground">{formWithDetails._count.responses} responses</div>
        </div>
      </div>

      {session ? (
        <FormResponse form={formWithDetails} />
      ) : (
        <div className="text-center py-8">Please sign in to submit a response</div>
      )}
    </div>
  )
}

