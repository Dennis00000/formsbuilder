'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface FormBuilderContentProps {
  userId: string
}

export function FormBuilderContent({ userId }: FormBuilderContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations("forms")
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          isPublic,
          questions: [], // Initial empty questions array
        }),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      
      toast({
        title: t("success.created"),
        description: t("form.title") + ": " + title,
      })
      
      router.push(`/${locale}/forms/${data.id}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error.title"),
        description: error instanceof Error ? error.message : t("error.description"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t("createNew")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("form.title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("form.description")}</Label>
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
              <Label htmlFor="public">{t("form.public")}</Label>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                t("form.create")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 