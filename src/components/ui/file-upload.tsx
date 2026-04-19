"use client"

import { useState, useRef, useId } from "react"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { uploadFile } from "@/lib/upload"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (url: string) => void
  onRemove?: () => void
  accept?: string
  maxSize?: number
  currentUrl?: string | null
  label?: string
}

export function FileUpload({
  onUpload,
  onRemove,
  accept = "image/*",
  maxSize = 5,
  currentUrl,
  label,
}: FileUploadProps) {
  const inputId = useId()
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isPdf = accept.includes("pdf")
  const acceptLabel = isPdf
    ? `PDF (max ${maxSize}MB)`
    : `JPG, PNG, WebP, GIF (max ${maxSize}MB)`

  async function processFile(file: File) {
    setError(null)
    setIsUploading(true)
    setFileName(file.name)

    const url = await uploadFile(file)
    setIsUploading(false)

    if (url) {
      setPreview(url)
      onUpload(url)
    } else {
      setError("Upload failed. Please try again.")
      setFileName(null)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleRemove() {
    setPreview(null)
    setFileName(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        aria-label={label ?? "Upload file"}
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200">
          {isPdf ? (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50">
              <FileText className="size-8 text-[#620E87] shrink-0" aria-hidden="true" />
              <span className="text-sm text-gray-700 truncate flex-1">
                {fileName ?? preview.split("/").pop()}
              </span>
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview}
              alt="Upload preview"
              className="w-full h-40 object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Remove file"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : isUploading ? (
        <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-[#620E87]/30 bg-purple-50/30">
          <Loader2 className="size-8 text-[#620E87]/60 animate-spin" aria-hidden="true" />
          <p className="text-sm text-gray-500">Uploading...</p>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer transition-colors",
            "border-2 border-dashed border-[#620E87]/30 hover:border-[#620E87]/60 hover:bg-purple-50/50",
            isDragging && "border-[#620E87] bg-purple-50"
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="size-7 text-[#620E87]/50" aria-hidden="true" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">{acceptLabel}</p>
          </div>
        </label>
      )}

      {error && (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
