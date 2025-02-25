"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createForm } from "@/lib/db"

interface FormBuilderProps {
  userId: string
}

export function FormBuilder({ userId }: FormBuilderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations("forms")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: t("error"),
        description: t("titleRequired"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const form = await createForm({
        title: formData.title.trim(),
        description: formData.description.trim(),
        isPublic: formData.isPublic,
        userId,
      })

      if (!form) {
        throw new Error(t("createError"))
      }

      toast({
        title: t("success"),
        description: t("formCreated"),
      })

      router.push(`/forms/${form.id}`)
    } catch (error) {
      toast({
        title: t("error"),
        description: t("createError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">{t("titleLabel")}</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder={t("titlePlaceholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("descriptionLabel")}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="public"
          checked={formData.isPublic}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
        />
        <Label htmlFor="public">{t("makePublic")}</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("creating") : t("create")}
      </Button>
    </form>
  )
}

