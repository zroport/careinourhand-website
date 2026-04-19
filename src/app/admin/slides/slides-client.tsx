"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  buttonText: string | null
  buttonLink: string | null
  order: number
  isActive: boolean
}

interface Props {
  slides: HeroSlide[]
}

export default function SlidesClient({ slides: initialSlides }: Props) {
  const router = useRouter()
  const [slides, setSlides] = useState(initialSlides)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    order: 0,
    isActive: true,
  })

  function openCreate() {
    setEditingSlide(null)
    setForm({ title: "", subtitle: "", imageUrl: "", buttonText: "", buttonLink: "", order: slides.length, isActive: true })
    setShowForm(true)
  }

  function openEdit(slide: HeroSlide) {
    setEditingSlide(slide)
    setForm({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      imageUrl: slide.imageUrl ?? "",
      buttonText: slide.buttonText ?? "",
      buttonLink: slide.buttonLink ?? "",
      order: slide.order,
      isActive: slide.isActive,
    })
    setShowForm(true)
  }

  async function handleSubmit() {
    setLoading(true)
    const url = editingSlide ? `/api/admin/slides/${editingSlide.id}` : "/api/admin/slides"
    const method = editingSlide ? "PUT" : "POST"

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this slide?")) return
    await fetch(`/api/admin/slides/${id}`, { method: "DELETE" })
    router.refresh()
  }

  async function toggleActive(slide: HeroSlide) {
    await fetch(`/api/admin/slides/${slide.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
    })
    router.refresh()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Slider</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the homepage hero slides</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Slide
        </button>
      </div>

      {slides.length === 0 && (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
          No slides yet. Click <strong>+ Add Slide</strong> to create your first one.
        </div>
      )}

      <div className="space-y-4">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white border rounded-xl p-5 flex items-center gap-4 shadow-sm">
            {slide.imageUrl ? (
              <img src={slide.imageUrl} alt={slide.title} className="w-24 h-16 object-cover rounded-lg border" />
            ) : (
              <div className="w-24 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800">{slide.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${slide.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {slide.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {slide.subtitle && <p className="text-sm text-gray-500 mt-0.5">{slide.subtitle}</p>}
              <p className="text-xs text-gray-400 mt-1">Order: {slide.order}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(slide)} className="text-xs px-3 py-1.5 border rounded-lg hover:bg-gray-50 transition">
                {slide.isActive ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => openEdit(slide)} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition">
                Edit
              </button>
              <button onClick={() => handleDelete(slide.id)} className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">{editingSlide ? "Edit Slide" : "New Slide"}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Caring for Your Future"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="e.g. NDIS services you can trust"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Image URL</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/uploads/hero1.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.buttonText}
                    onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                    placeholder="Get Started"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Button Link</label>
                  <input
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.buttonLink}
                    onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
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
                disabled={loading || !form.title}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : editingSlide ? "Save Changes" : "Create Slide"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}