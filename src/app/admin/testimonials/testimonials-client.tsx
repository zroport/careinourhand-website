"use client"

import { useState, useTransition } from "react"
import { Star, Plus, Pencil, Trash2 } from "lucide-react"
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonial,
} from "@/actions/admin/testimonial-actions"
import { useRouter } from "next/navigation"

interface Testimonial {
  id: string
  name: string
  role: string | null
  content: string
  rating: number
  isActive: boolean
  order: number
}

interface Props {
  testimonials: Testimonial[]
}

const emptyForm = {
  name: "",
  role: "",
  content: "",
  rating: 5,
  isActive: true,
  order: 0,
}

export default function TestimonialsClient({ testimonials }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState("")

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, order: testimonials.length })
    setError("")
    setShowForm(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({
      name: t.name,
      role: t.role ?? "",
      content: t.content,
      rating: t.rating,
      isActive: t.isActive,
      order: t.order,
    })
    setError("")
    setShowForm(true)
  }

  function handleSubmit() {
    const payload = { ...form, role: form.role || undefined }
    startTransition(async () => {
      const res = editing
        ? await updateTestimonial(editing.id, payload)
        : await createTestimonial(payload)
      if (res.error) {
        setError(res.error)
        return
      }
      setShowForm(false)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return
    startTransition(async () => {
      await deleteTestimonial(id)
      router.refresh()
    })
  }

  function handleToggle(t: Testimonial) {
    startTransition(async () => {
      await toggleTestimonial(t.id, !t.isActive)
      router.refresh()
    })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage community testimonials shown on the homepage</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#620E87] text-white px-4 py-2 rounded-lg hover:bg-[#4e0b6b] transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
          No testimonials yet. Click <strong>Add Testimonial</strong> to create your first one.
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white border rounded-xl p-5 flex items-start gap-4 shadow-sm">
            <div className="flex items-center justify-center size-10 rounded-full bg-[#620E87]/10 font-bold text-[#620E87] text-sm shrink-0">
              {t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-800">{t.name}</p>
                {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {t.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex gap-0.5 mt-1" aria-label={`${t.rating} stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-3 fill-[#89C541] text-[#89C541]" />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
              <p className="text-xs text-gray-400 mt-1">Order: {t.order}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleToggle(t)}
                disabled={isPending}
                className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition"
              >
                {t.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => openEdit(t)}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={isPending}
                className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editing ? "Edit Testimonial" : "New Testimonial"}</h2>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#620E87]"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sarah M."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Role / Title</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#620E87]"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Participant, Parent & Guardian"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Testimonial *</label>
                <textarea
                  rows={4}
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#620E87] resize-none"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="What did they say..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Rating (1–5)</label>
                  <select
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#620E87]"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#620E87]"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Active (show on site)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || !form.name || !form.content}
                className="flex-1 bg-[#620E87] text-white rounded-lg py-2 text-sm hover:bg-[#4e0b6b] transition disabled:opacity-50"
              >
                {isPending ? "Saving..." : editing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
