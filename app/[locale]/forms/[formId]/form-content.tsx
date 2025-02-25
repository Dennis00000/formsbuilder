'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Heart, MessageSquare, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { Database } from "@/types/supabase"

type Form = Database['public']['Tables']['forms']['Row'] & {
  user: { email: string } | null
  likes: { count: number }[]
  comments: { 
    id: string
    content: string
    created_at: string
    updated_at: string
    is_edited: boolean
    users: { email: string }
  }[]
}

interface FormContentProps {
  form: Form
  isOwner: boolean
  currentUserEmail: string
  hasLiked: boolean
}

export function FormContent({ form, isOwner, currentUserEmail, hasLiked }: FormContentProps) {
  const t = useTranslations()
  const router = useRouter()
  const { toast } = useToast()
  const [isLiking, setIsLiking] = useState(false)
  const [liked, setLiked] = useState(hasLiked)
  const [comment, setComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)

  async function handleLike() {
    if (!currentUserEmail) {
      toast({
        title: t("forms.error.title"),
        description: t("forms.error.unauthorized"),
      })
      return
    }

    setIsLiking(true)
    try {
      const response = await fetch(`/api/forms/${form.id}/like`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error(await response.text())

      setLiked(!liked)
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("forms.error.title"),
        description: error instanceof Error ? error.message : t("forms.error.description"),
      })
    } finally {
      setIsLiking(false)
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!currentUserEmail) {
      toast({
        title: t("forms.error.title"),
        description: t("forms.error.unauthorized"),
      })
      return
    }

    setIsCommenting(true)
    try {
      const response = await fetch(`/api/forms/${form.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      })

      if (!response.ok) throw new Error(await response.text())

      setComment("")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("forms.error.title"),
        description: error instanceof Error ? error.message : t("forms.error.description"),
      })
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("forms.createdBy", { email: form.user?.email })}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {form.description || t("dashboard.noDescription")}
          </p>
          <div className="space-y-4">
            {form.questions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("forms.noQuestions")}
              </p>
            ) : (
              form.questions.map((question: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium">{question.text}</h3>
                  {/* Add question type specific rendering here */}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current text-red-500" : ""}`} />
              <span>{form.likes[0]?.count || 0}</span>
            </Button>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{form.comments?.length || 0}</span>
            </div>
          </div>
          {isOwner && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/forms/${form.id}/edit`}>{t("forms.form.edit")}</a>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("forms.comments.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentUserEmail && (
            <form onSubmit={handleComment} className="flex gap-2">
              <Textarea
                placeholder={t("forms.comments.placeholder")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isCommenting}
                required
              />
              <Button type="submit" disabled={isCommenting}>
                <Send className="w-4 h-4" />
                <span className="sr-only">{t("forms.comments.submit")}</span>
              </Button>
            </form>
          )}
          {form.comments?.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t("forms.comments.noComments")}
            </p>
          ) : (
            <div className="space-y-4">
              {form.comments?.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{comment.users.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                      {comment.is_edited && ` (${t("forms.comments.edited")})`}
                    </p>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 