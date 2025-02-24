import { FormBuilder } from "@/components/form-builder"

export default function NewFormPage() {
  return (
    <main className="container py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Create New Form</h1>
        <FormBuilder />
      </div>
    </main>
  )
}

