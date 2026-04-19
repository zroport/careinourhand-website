"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface PageDefault {
  slug: string
  name: string
  defaultHeading: string
  defaultSubheading: string
}

export interface PageHeaderRecord {
  id: string
  pageSlug: string
  heading: string
  subheading: string | null
  imageUrl: string | null
}

interface Props {
  pages: PageDefault[]
  records: PageHeaderRecord[]
}

export function PageHeadersManager({ pages, records }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [form, setForm] = useState({
    heading: "",
    subheading: "",
    imageUrl: "",
  })

  function getRecord(slug: string) {
    return records.find((r) => r.pageSlug === slug) ?? null
  }

  function openEdit(page: PageDefault) {
    const record = getRecord(page.slug)
    setForm({
      heading: record?.heading ?? page.defaultHeading,
      subheading: record?.subheading ?? page.defaultSubheading,
      imageUrl: record?.imageUrl ?? "",
    })
    setEditingSlug(page.slug)
  }

  async function handleSubmit() {
    if (!editingSlug) return
    setLoading(true)

    const existing = getRecord(editingSlug)

    if (existing) {
      await fetch(`/api/admin/page-headers/${existing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pageSlug: editingSlug }),
      })
    } else {
      await fetch("/api/admin/page-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pageSlug: editingSlug }),
      })
    }

    setEditingSlug(null)
    setLoading(false)
    router.refresh()
  }

  async function handleReset(id: string) {
    if (!confirm("Reset this page header to default?")) return
    await fetch(`/api/admin/page-headers/${id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {pages.map((page) => {
        const record = getRecord(page.slug)
        const isCustom = !!record

        return (
          <div key={page.slug} className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-800">{page.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isCustom
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {isCustom ? "Custom" : "Default"}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {isCustom ? record!.heading : page.defaultHeading}
                </p>
                {(isCustom ? record!.subheading : page.defaultSubheading) && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {isCustom ? record!.subheading : page.defaultSubheading}
                  </p>
                )}
                {isCustom && record!.imageUrl && (
                  <p className="text-xs text-blue-400 mt-1">🖼 {record!.imageUrl}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {isCustom && (
                  <button
                    onClick={() => handleReset(record!.id)}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => openEdit(page)}
                  className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                >
                  {isCustom ? "Edit" : "Customise"}
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Modal */}
      {editingSlug && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-bold mb-4">
              Edit — {pages.find((p) => p.slug === editingSlug)?.name}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Heading *</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="Page heading"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subheading</label>
                <textarea
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  value={form.subheading}
                  onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                  placeholder="Page subheading"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Background Image URL</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/uploads/about-hero.jpg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditingSlug(null)}
                className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.heading}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}