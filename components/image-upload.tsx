"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { uploadFormImage } from "@/lib/storage"

interface ImageUploadProps {
  onUpload: (url: string) => void
  onError: (error: string) => void
}

export function ImageUpload({ onUpload, onError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        const file = acceptedFiles[0]

        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error("File size too large. Maximum size is 5MB.")
        }

        const userId = "TODO: Get user ID" // You'll need to pass this from the parent component
        const url = await uploadFormImage(file, userId)
        onUpload(url)
      } catch (error) {
        onError(error instanceof Error ? error.message : "Failed to upload image")
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onError],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {isDragActive ? "Drop the image here" : "Drag and drop an image, or click to select"}
      </p>
      {isUploading && (
        <div className="mt-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      )}
    </div>
  )
}

