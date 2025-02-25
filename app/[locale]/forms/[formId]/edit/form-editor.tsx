'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

interface FormEditorProps {
  form: any // Replace with proper type later
}

export function FormEditor({ form }: FormEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(form.title)
  const [description, setDescription] = useState(form.description || '')
  const [isPublic, setIsPublic] = useState(form.is_public)
  
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('forms')
        .update({
          title,
          description,
          is_public: isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', form.id)

      if (error) throw error

      toast({
        title: t("forms.success.updated"),
      })

      router.refresh()
      router.push(`/${locale}/dashboard`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("forms.error.title"),
        description: error instanceof Error ? error.message : t("forms.error.description"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-10">
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
              <CardTitle>{t("forms.form.edit")}</CardTitle>
              <CardDescription>{t("forms.form.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("forms.form.title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("forms.form.description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isLoading}
              />
              <Label htmlFor="public">{t("forms.form.public")}</Label>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                t("forms.form.save")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 