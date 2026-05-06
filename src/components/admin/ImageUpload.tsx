"use client"

import { useRef, useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Upload failed")
        return
      }

      onChange(data.url)
    } catch {
      setError("Upload failed. Check your connection.")
    } finally {
      setUploading(false)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border bg-gray-50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Upload button */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleInputChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          {uploading ? (
            <Loader2 className="size-3.5 mr-1.5 animate-spin" />
          ) : (
            <Upload className="size-3.5 mr-1.5" />
          )}
          {uploading ? "Uploading…" : "Choose Image"}
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Manual URL fallback */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Or paste a URL directly:</p>
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="text-sm h-8"
        />
      </div>
    </div>
  )
}
