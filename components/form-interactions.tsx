"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Heart, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createComment, toggleLike, type Comment } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { debounce } from "lodash"

interface FormInteractionsProps {
  formId: string
  userId: string
  initialComments: Comment[]
  initialLikeCount: number
  initialLiked: boolean
}

export function FormInteractions({
  formId,
  userId,
  initialComments,
  initialLikeCount,
  initialLiked,
}: FormInteractionsProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialLiked)
  // Add proper loading states and error boundaries
  const [isLoading, setIsLoading] = useState(false)

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const comment = await createComment({
        formId,
        userId,
        content: newComment.trim(),
      })

      setComments([comment, ...comments])
      setNewComment("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add debouncing for like actions
  const handleLike = useMemo(
    () =>
      debounce(async () => {
        try {
          const liked = await toggleLike(formId, userId)
          setIsLiked(liked)
          setLikeCount((prev) => (liked ? prev + 1 : prev - 1))
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update like",
            variant: "destructive",
          })
        }
      }, 300),
    [formId, userId, toast],
  )

  // Add proper cleanup
  useEffect(() => {
    return () => {
      handleLike.cancel()
    }
  }, [handleLike])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className={isLiked ? "text-red-500" : ""} onClick={handleLike}>
          <Heart className="mr-2 h-4 w-4" />
          {likeCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          {comments.length}
        </Button>
      </div>

      <form onSubmit={handleComment} className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{comment.user?.email}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

