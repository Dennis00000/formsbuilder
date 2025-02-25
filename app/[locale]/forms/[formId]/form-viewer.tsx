'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Heart, MessageSquare } from "lucide-react"

interface FormViewerProps {
  form: any
}

export function FormViewer({ form }: FormViewerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(form.likes?.[0]?.count || 0)
  const [hasLiked, setHasLiked] = useState(false)
  
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has liked the form
    async function checkLike() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data } = await supabase
        .from('form_likes')
        .select()
        .eq('form_id', form.id)
        .single()

      setHasLiked(!!data)
    }

    checkLike()
  }, [form.id])

  async function handleLike() {
    if (isLoading) return
    setIsLoading(true)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      if (hasLiked) {
        await supabase
          .from('form_likes')
          .delete()
          .eq('form_id', form.id)
        setLikeCount(prev => prev - 1)
        setHasLiked(false)
      } else {
        await supabase
          .from('form_likes')
          .insert({ form_id: form.id })
        setLikeCount(prev => prev + 1)
        setHasLiked(true)
      }

      router.refresh()
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
    <div className="container max-w-4xl py-10">
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
              <CardTitle className="text-2xl">{form.title}</CardTitle>
              <CardDescription>{form.description || t("forms.noDescription")}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 px-2"
              asChild
            >
              <a href={`/${locale}/forms/${form.id}/comments`}>
                <MessageSquare className="h-4 w-4" />
                <span>{form.comments?.[0]?.count || 0}</span>
              </a>
            </Button>
            <div>
              {t("forms.createdBy", { email: form.user?.email || t("forms.anonymous") })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Form content will go here */}
          <pre className="bg-muted p-4 rounded-lg overflow-auto">
            {JSON.stringify(form.questions, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 