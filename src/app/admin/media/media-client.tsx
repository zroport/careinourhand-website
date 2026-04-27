"use client"

import { useState, useTransition, useRef } from "react"
import { Trash2, Upload, Copy, Check, Pencil } from "lucide-react"
import { deleteMedia, updateMediaAlt } from "@/actions/admin/media-actions"
import { useRouter } from "next/navigation"

interface MediaItem {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number | null
  altText: string | null
  createdAt: Date
}

interface Props {
  media: MediaItem[]
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaClient({ media: initialMedia }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [altDraft, setAltDraft] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    setUploadError("")

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          setUploadError(body.error ?? "Upload failed")
        }
      } catch {
        setUploadError("Upload failed")
      }
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ""
    router.refresh()
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this file permanently?")) return
    startTransition(async () => {
      await deleteMedia(id)
      router.refresh()
    })
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.fileUrl)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function startEditAlt(item: MediaItem) {
    setEditingId(item.id)
    setAltDraft(item.altText ?? "")
  }

  function saveAlt(id: string) {
    startTransition(async () => {
      await updateMediaAlt(id, altDraft)
      setEditingId(null)
      router.refresh()
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">{initialMedia.length} file{initialMedia.length !== 1 ? "s" : ""} uploaded</p>
        </div>
        <label className="flex items-center gap-2 bg-[#620E87] text-white px-4 py-2 rounded-lg hover:bg-[#4e0b6b] transition text-sm font-medium cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Files"}
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{uploadError}</p>
      )}

      {initialMedia.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
          No files uploaded yet. Click <strong>Upload Files</strong> to add your first file.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {initialMedia.map((item) => (
          <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm group relative">
            {/* Preview */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
              {item.fileType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.fileUrl}
                  alt={item.altText ?? item.fileName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <span className="text-2xl">📄</span>
                  <span className="text-xs uppercase">{item.fileType.split("/")[1]}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="text-xs font-medium text-gray-700 truncate" title={item.fileName}>
                {item.fileName}
              </p>
              <p className="text-xs text-gray-400">{formatBytes(item.fileSize)}</p>

              {/* Alt text */}
              {editingId === item.id ? (
                <div className="mt-1 flex gap-1">
                  <input
                    className="flex-1 text-xs border rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#620E87]"
                    value={altDraft}
                    onChange={(e) => setAltDraft(e.target.value)}
                    placeholder="Alt text"
                    autoFocus
                  />
                  <button
                    onClick={() => saveAlt(item.id)}
                    disabled={isPending}
                    className="text-xs bg-[#620E87] text-white px-1.5 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p
                  className="text-xs text-gray-400 truncate mt-0.5 cursor-pointer hover:text-[#620E87]"
                  title="Click to edit alt text"
                  onClick={() => startEditAlt(item)}
                >
                  {item.altText || <span className="italic">Add alt text…</span>}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyUrl(item)}
                title="Copy URL"
                className="p-1.5 bg-white rounded-lg shadow border hover:bg-gray-50 transition"
              >
                {copiedId === item.id ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => startEditAlt(item)}
                title="Edit alt text"
                className="p-1.5 bg-white rounded-lg shadow border hover:bg-gray-50 transition"
              >
                <Pencil className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                title="Delete"
                className="p-1.5 bg-white rounded-lg shadow border hover:bg-red-50 transition"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
