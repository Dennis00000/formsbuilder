"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export function FormResponse({ form }: { form: any }) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/forms/${form.id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) throw new Error("Failed to submit response")

      router.push(`/forms/${form.id}/thank-you`)
    } catch (error) {
      console.error("Error submitting response:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {form.questions.map((question: any) => (
        <div key={question.id} className="space-y-4">
          <Label>{question.title}</Label>

          {question.type === "text" && (
            <Input
              value={answers[question.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            />
          )}

          {question.type === "choice" && (
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
            >
              {question.options?.map((option: string, i: number) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                  <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "multipleChoice" && (
            <div className="space-y-2">
              {question.options?.map((option: string, i: number) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${i}`}
                    checked={answers[question.id]?.includes(option)}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answers[question.id] || []
                      setAnswers({
                        ...answers,
                        [question.id]: checked
                          ? [...currentAnswers, option]
                          : currentAnswers.filter((a: string) => a !== option),
                      })
                    }}
                  />
                  <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="submit">Submit Response</Button>
    </form>
  )
}

