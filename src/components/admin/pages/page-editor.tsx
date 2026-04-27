"use client"

import { useState, useTransition } from "react"
import { Save, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updatePage } from "@/actions/admin/page-actions"
import type { PageSchema, ContentBlock } from "@/lib/page-content"

interface PageEditorProps {
  schema: PageSchema
  initialContent: ContentBlock
}

export function PageEditor({ schema, initialContent }: PageEditorProps) {
  const [content, setContent] = useState<ContentBlock>(initialContent)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = (sectionKey: string, fieldKey: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] ?? {}), [fieldKey]: value },
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setError(null)
    startTransition(async () => {
      const result = await updatePage(schema.slug, content)
      if (!result.success) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{schema.title} Page</h1>
          <p className="text-sm text-gray-500 mt-1">Edit content displayed on the public page.</p>
        </div>
        <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isPending ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {schema.sections.map((section) => (
          <div key={section.key} className="glass-card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-white/40">
              {section.label}
            </h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <Label htmlFor={`${section.key}-${field.key}`} className="text-sm font-medium text-gray-700">
                    {field.label}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={`${section.key}-${field.key}`}
                      value={content[section.key]?.[field.key] ?? field.default}
                      onChange={(e) => setField(section.key, field.key, e.target.value)}
                      rows={4}
                      className="mt-1"
                      placeholder={field.default}
                    />
                  ) : (
                    <Input
                      id={`${section.key}-${field.key}`}
                      value={content[section.key]?.[field.key] ?? field.default}
                      onChange={(e) => setField(section.key, field.key, e.target.value)}
                      className="mt-1"
                      placeholder={field.default}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
