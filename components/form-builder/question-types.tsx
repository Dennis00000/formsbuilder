"use client"

import { Grip, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type QuestionType =
  | "text"
  | "longText"
  | "choice"
  | "multipleChoice"
  | "email"
  | "number"
  | "date"
  | "rating"
  | "file"

interface QuestionProps {
  id: string
  type: QuestionType
  title: string
  required?: boolean
  description?: string
  options?: string[]
  maxLength?: number
  minValue?: number
  maxValue?: number
  allowedFileTypes?: string[]
  maxFileSize?: number
  onChange: (updates: Partial<QuestionProps>) => void
  onDelete: () => void
  dragHandleProps?: any
}

export function Question({
  id,
  type,
  title,
  required = false,
  description = "",
  options = [],
  maxLength,
  minValue,
  maxValue,
  allowedFileTypes = [],
  maxFileSize,
  onChange,
  onDelete,
  dragHandleProps,
}: QuestionProps) {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div {...dragHandleProps} className="mt-2">
            <Grip className="h-5 w-5 text-muted-foreground cursor-move" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input placeholder="Question" value={title} onChange={(e) => onChange({ title: e.target.value })} />
              </div>
              <Select value={type} onValueChange={(value: QuestionType) => onChange({ type: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Short Text</SelectItem>
                  <SelectItem value="longText">Long Text</SelectItem>
                  <SelectItem value="choice">Single Choice</SelectItem>
                  <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => onChange({ description: e.target.value })}
                className="h-20"
              />
            </div>

            {(type === "choice" || type === "multipleChoice") && (
              <div className="space-y-2">
                {options.map((option, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {type === "choice" ? (
                      <div className="h-4 w-4 rounded-full border" />
                    ) : (
                      <div className="h-4 w-4 rounded border" />
                    )}
                    <Input
                      placeholder={`Option ${i + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options]
                        newOptions[i] = e.target.value
                        onChange({ options: newOptions })
                      }}
                    />
                    {options.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newOptions = options.filter((_, index) => index !== i)
                          onChange({ options: newOptions })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => onChange({ options: [...options, ""] })}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Option
                </Button>
              </div>
            )}

            {(type === "text" || type === "longText") && (
              <div className="flex items-center gap-4">
                <Label htmlFor={`maxLength-${id}`}>Max Length</Label>
                <Input
                  id={`maxLength-${id}`}
                  type="number"
                  value={maxLength || ""}
                  onChange={(e) => onChange({ maxLength: Number.parseInt(e.target.value) || undefined })}
                  className="w-24"
                />
              </div>
            )}

            {type === "number" && (
              <div className="flex items-center gap-4">
                <Label htmlFor={`minValue-${id}`}>Min Value</Label>
                <Input
                  id={`minValue-${id}`}
                  type="number"
                  value={minValue || ""}
                  onChange={(e) => onChange({ minValue: Number.parseInt(e.target.value) || undefined })}
                  className="w-24"
                />
                <Label htmlFor={`maxValue-${id}`}>Max Value</Label>
                <Input
                  id={`maxValue-${id}`}
                  type="number"
                  value={maxValue || ""}
                  onChange={(e) => onChange({ maxValue: Number.parseInt(e.target.value) || undefined })}
                  className="w-24"
                />
              </div>
            )}

            {type === "file" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor={`fileTypes-${id}`}>Allowed File Types</Label>
                  <Input
                    id={`fileTypes-${id}`}
                    placeholder="e.g., .pdf,.doc,.docx"
                    value={allowedFileTypes.join(",")}
                    onChange={(e) => onChange({ allowedFileTypes: e.target.value.split(",").map((t) => t.trim()) })}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor={`maxFileSize-${id}`}>Max File Size (MB)</Label>
                  <Input
                    id={`maxFileSize-${id}`}
                    type="number"
                    value={maxFileSize || ""}
                    onChange={(e) => onChange({ maxFileSize: Number.parseInt(e.target.value) || undefined })}
                    className="w-24"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id={`required-${id}`}
                checked={required}
                onCheckedChange={(checked) => onChange({ required: checked })}
              />
              <Label htmlFor={`required-${id}`}>Required</Label>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

