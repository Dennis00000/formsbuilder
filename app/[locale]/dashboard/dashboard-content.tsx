'use client'

import { Plus, Pencil, Eye, Trash2, Heart, LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

type Form = Database['public']['Tables']['forms']['Row']

interface DashboardContentProps {
  forms: Form[] | null
  locale: string
}

export function DashboardContent({ forms, locale }: DashboardContentProps) {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteFormId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/forms/${deleteFormId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      toast({
        title: t("forms.success.deleted"),
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("forms.error.title"),
        description: error instanceof Error ? error.message : t("forms.error.description"),
      })
    } finally {
      setIsDeleting(false)
      setDeleteFormId(null)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      await supabase.auth.signOut()
      // Force a hard refresh to clear all client state
      window.location.href = `/${locale}`
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        variant: "destructive",
        title: t("auth.error.title"),
        description: t("auth.error.signOut"),
      })
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{t("dashboard.title")}</h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("auth.signOut")}
          </Button>
        </div>
        <Button asChild>
          <a href={`/${locale}/forms/new`}>
            <Plus className="w-4 h-4 mr-2" />
            {t("dashboard.createForm")}
          </a>
        </Button>
      </div>

      {!forms || forms.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">{t("dashboard.noForms")}</h3>
              <p className="text-muted-foreground">{t("dashboard.createFirstForm")}</p>
              <Button asChild>
                <a href={`/${locale}/forms/new`}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("dashboard.createForm")}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <p>
                    {t("dashboard.lastEdited", {
                      date: new Date(form.updated_at).toLocaleDateString(locale)
                    })}
                  </p>
                  {form.is_public && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{form._count?.likes || 0}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/${locale}/forms/${form.id}`}>
                    <Eye className="w-4 h-4" />
                    <span className="sr-only">{t("forms.form.preview")}</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/${locale}/forms/${form.id}/edit`}>
                    <Pencil className="w-4 h-4" />
                    <span className="sr-only">{t("forms.form.edit")}</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteFormId(form.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="sr-only">{t("forms.form.delete")}</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteFormId} onOpenChange={() => setDeleteFormId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("forms.form.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("forms.confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 