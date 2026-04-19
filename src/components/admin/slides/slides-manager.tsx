"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  ImageOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { createSlide, updateSlide, deleteSlide, reorderSlides } from "@/actions/admin/slide-actions"
import { cn } from "@/lib/utils"

interface Slide {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  buttonText: string | null
  buttonLink: string | null
  order: number
  isActive: boolean
}

interface FormState {
  title: string
  subtitle: string
  imageUrl: string
  buttonText: string
  buttonLink: string
  order: number
  isActive: boolean
}

const emptyForm: FormState = {
  title: "",
  subtitle: "",
  imageUrl: "",
  buttonText: "",
  buttonLink: "",
  order: 0,
  isActive: true,
}

export function SlidesManager({ initialSlides }: { initialSlides: Slide[] }) {
  const router = useRouter()
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [modalOpen, setModalOpen] = useState(false)
  const [editSlide, setEditSlide] = useState<Slide | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sorted = [...slides].sort((a, b) => a.order - b.order)

  function openAdd() {
    setEditSlide(null)
    setForm({ ...emptyForm, order: slides.length })
    setFormError(null)
    setModalOpen(true)
  }

  function openEdit(slide: Slide) {
    setEditSlide(slide)
    setForm({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      imageUrl: slide.imageUrl ?? "",
      buttonText: slide.buttonText ?? "",
      buttonLink: slide.buttonLink ?? "",
      order: slide.order,
      isActive: slide.isActive,
    })
    setFormError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditSlide(null)
  }

  function update(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function handleSave() {
    if (!form.title.trim()) {
      setFormError("Title is required")
      return
    }

    const data = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || undefined,
      imageUrl: form.imageUrl || undefined,
      buttonText: form.buttonText.trim() || undefined,
      buttonLink: form.buttonLink.trim() || undefined,
      order: form.order,
      isActive: form.isActive,
    }

    startTransition(async () => {
      if (editSlide) {
        const result = await updateSlide(editSlide.id, data)
        if (result.error) { setFormError(result.error); return }
        setSlides((prev) =>
          prev.map((s) =>
            s.id === editSlide.id
              ? {
                  ...s,
                  title: data.title,
                  subtitle: data.subtitle ?? null,
                  imageUrl: data.imageUrl ?? null,
                  buttonText: data.buttonText ?? null,
                  buttonLink: data.buttonLink ?? null,
                  order: data.order,
                  isActive: data.isActive,
                }
              : s
          )
        )
      } else {
        const result = await createSlide(data)
        if (result.error) { setFormError(result.error); return }
        router.refresh()
      }
      closeModal()
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this slide? This cannot be undone.")) return
    startTransition(async () => {
      const result = await deleteSlide(id)
      if (!result.error) setSlides((prev) => prev.filter((s) => s.id !== id))
    })
  }

  function handleMove(id: string, direction: "up" | "down") {
    const sortedIds = sorted.map((s) => s.id)
    const idx = sortedIds.indexOf(id)
    if (direction === "up" && idx === 0) return
    if (direction === "down" && idx === sortedIds.length - 1) return

    const newIds = [...sortedIds]
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    ;[newIds[idx], newIds[swapIdx]] = [newIds[swapIdx], newIds[idx]]

    startTransition(async () => {
      await reorderSlides(newIds)
      setSlides((prev) =>
        prev.map((s) => ({ ...s, order: newIds.indexOf(s.id) }))
      )
    })
  }

  return (
    <div>
      {sorted.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-400">
          No slides yet. Add your first slide.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((slide, i) => (
            <div
              key={slide.id}
              className="glass-card p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="size-16 shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#620E87] to-[#7d1aab] flex items-center justify-center">
                {slide.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff className="size-6 text-white/50" aria-hidden="true" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-gray-900 truncate">
                    {slide.title}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 px-2 py-0.5 rounded-full text-xs font-medium",
                      slide.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {slide.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {slide.subtitle && (
                  <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">Order: {slide.order}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMove(slide.id, "up")}
                  disabled={i === 0 || isPending}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  aria-label="Move slide up"
                >
                  <ChevronUp className="size-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleMove(slide.id, "down")}
                  disabled={i === sorted.length - 1 || isPending}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  aria-label="Move slide down"
                >
                  <ChevronDown className="size-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => openEdit(slide)}
                  className="p-1.5 rounded-lg hover:bg-purple-50 text-[#620E87] transition-colors"
                  aria-label="Edit slide"
                >
                  <Edit className="size-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={isPending}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                  aria-label="Delete slide"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button
          onClick={openAdd}
          className="bg-[#89C541] hover:bg-[#6da033] text-white gap-2"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add New Slide
        </Button>
      </div>

      {/* Modal */}
      <DialogPrimitive.Root
        open={modalOpen}
        onOpenChange={(o) => {
          if (!o) closeModal()
        }}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <DialogPrimitive.Content
            aria-labelledby="slide-modal-title"
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
              <DialogPrimitive.Title
                id="slide-modal-title"
                className="text-lg font-bold text-gray-900"
              >
                {editSlide ? "Edit Slide" : "Add New Slide"}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <button
                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="size-5 text-gray-500" aria-hidden="true" />
                </button>
              </DialogPrimitive.Close>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <FileUpload
                key={editSlide?.id ?? "new"}
                label="Slide Image"
                accept="image/*"
                maxSize={5}
                currentUrl={form.imageUrl || null}
                onUpload={(url) => update({ imageUrl: url })}
                onRemove={() => update({ imageUrl: "" })}
              />

              <div className="space-y-1.5">
                <Label htmlFor="slide-title">
                  Title <span className="text-red-500" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="slide-title"
                  value={form.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="Your Life, In Caring Hands."
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slide-subtitle">Subtitle</Label>
                <Textarea
                  id="slide-subtitle"
                  value={form.subtitle}
                  onChange={(e) => update({ subtitle: e.target.value })}
                  rows={3}
                  placeholder="Supporting Sydney's diverse communities..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="slide-btn-text">Button Text</Label>
                  <Input
                    id="slide-btn-text"
                    value={form.buttonText}
                    onChange={(e) => update({ buttonText: e.target.value })}
                    placeholder="Our Services"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slide-btn-link">Button Link</Label>
                  <Input
                    id="slide-btn-link"
                    value={form.buttonLink}
                    onChange={(e) => update({ buttonLink: e.target.value })}
                    placeholder="/services"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="slide-order">Display Order</Label>
                <Input
                  id="slide-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => update({ order: parseInt(e.target.value) || 0 })}
                  className="w-24"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="slide-isActive"
                  checked={form.isActive}
                  onChange={(e) => update({ isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#620E87]"
                />
                <Label htmlFor="slide-isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>

              {formError && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={isPending}
                  className="bg-[#89C541] hover:bg-[#6da033] text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
                      Saving...
                    </>
                  ) : editSlide ? (
                    "Save Changes"
                  ) : (
                    "Create Slide"
                  )}
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
