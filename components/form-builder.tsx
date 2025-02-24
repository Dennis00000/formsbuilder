"use client"

import { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Question = {
  id: string
  type: "text" | "choice" | "multipleChoice"
  title: string
  options?: string[]
}

export function FormBuilder() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: Math.random().toString(),
      type,
      title: "",
      options: type !== "text" ? [""] : undefined,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestions(items)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          questions,
        }),
      })

      if (!response.ok) throw new Error("Failed to create form")

      // Handle success (e.g., redirect to the new form)
    } catch (error) {
      console.error("Error creating form:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Input placeholder="Form Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input placeholder="Form Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <Card className="mb-4" ref={provided.innerRef} {...provided.draggableProps}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <Input
                              placeholder="Question"
                              value={question.title}
                              onChange={(e) =>
                                updateQuestion(question.id, {
                                  title: e.target.value,
                                })
                              }
                            />
                            {question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, i) => (
                                  <Input
                                    key={i}
                                    placeholder={`Option ${i + 1}`}
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options!]
                                      newOptions[i] = e.target.value
                                      updateQuestion(question.id, {
                                        options: newOptions,
                                      })
                                    }}
                                  />
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateQuestion(question.id, {
                                      options: [...question.options!, ""],
                                    })
                                  }
                                >
                                  Add Option
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="space-x-4">
        <Button onClick={() => addQuestion("text")}>Add Text Question</Button>
        <Button onClick={() => addQuestion("choice")}>Add Single Choice Question</Button>
        <Button onClick={() => addQuestion("multipleChoice")}>Add Multiple Choice Question</Button>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Save Form
      </Button>
    </div>
  )
}

