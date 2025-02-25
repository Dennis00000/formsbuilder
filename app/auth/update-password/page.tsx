import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full py-12 flex items-center justify-center bg-background">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 [mask-image:radial-gradient(farthest-side_at_center,white,transparent)] -z-10" />
        <UpdatePasswordForm />
      </div>
    </div>
  )
}

