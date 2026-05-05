"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface LogoData {
  faviconUrl?: string
  horizontalLogoUrl?: string
  verticalLogoUrl?: string
  footerLogoUrl?: string
  fullHeaderLogoUrl?: string
}

type LogoType = "favicon" | "horizontal" | "vertical" | "footer" | "fullHeader"

const SECTIONS: {
  key: LogoType
  label: string
  field: keyof LogoData
  size: string
  formats: string
  accept: string
}[] = [
  {
    key: "favicon",
    label: "Favicon",
    field: "faviconUrl",
    size: "32×32px or 64×64px",
    formats: "ICO, PNG, SVG",
    accept: ".ico,.png,.svg",
  },
  {
    key: "horizontal",
    label: "Horizontal Logo (Navbar / Header)",
    field: "horizontalLogoUrl",
    size: "200×60px",
    formats: "PNG, SVG, WEBP",
    accept: ".png,.svg,.webp",
  },
  {
    key: "vertical",
    label: "Vertical Logo (Login Page)",
    field: "verticalLogoUrl",
    size: "200×200px",
    formats: "PNG, SVG, WEBP",
    accept: ".png,.svg,.webp",
  },
  {
    key: "footer",
    label: "Footer Logo",
    field: "footerLogoUrl",
    size: "180×50px",
    formats: "PNG, SVG, WEBP",
    accept: ".png,.svg,.webp",
  },
  {
    key: "fullHeader",
    label: "Full Header Logo",
    field: "fullHeaderLogoUrl",
    size: "400×120px",
    formats: "PNG, SVG, WEBP",
    accept: ".png,.svg,.webp",
  },
]

function LogoSection({
  section,
  currentUrl,
  onUploaded,
}: {
  section: (typeof SECTIONS)[number]
  currentUrl?: string
  onUploaded: (type: LogoType, url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    setStatus(null)
    const fd = new FormData()
    fd.append("logoType", section.key)
    fd.append("file", file)
    try {
      const res = await fetch("/api/admin/logos/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: "error", msg: data.error ?? "Upload failed" })
      } else {
        setStatus({ type: "success", msg: "Uploaded successfully" })
        onUploaded(section.key, data.url)
      }
    } catch {
      setStatus({ type: "error", msg: "Network error" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{section.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          {/* Preview */}
          <div className="w-32 h-20 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            {currentUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt={section.label}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <span className="text-xs text-gray-400 text-center px-2">No logo uploaded</span>
            )}
          </div>

          {/* Upload */}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-gray-500">
              Recommended: <strong>{section.size}</strong> — {section.formats}
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={section.accept}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
                e.target.value = ""
              }}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading…" : "Choose File"}
            </Button>
          </div>
        </div>

        {status && (
          <p
            className={`text-sm font-medium ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.type === "success" ? "✓" : "✗"} {status.msg}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function LogosPage() {
  const [logos, setLogos] = useState<LogoData>({})

  useEffect(() => {
    fetch("/api/logos")
      .then((r) => r.json())
      .then(setLogos)
      .catch(() => {})
  }, [])

  function handleUploaded(type: LogoType, url: string) {
    const fieldMap: Record<LogoType, keyof LogoData> = {
      favicon: "faviconUrl",
      horizontal: "horizontalLogoUrl",
      vertical: "verticalLogoUrl",
      footer: "footerLogoUrl",
      fullHeader: "fullHeaderLogoUrl",
    }
    setLogos((prev) => ({ ...prev, [fieldMap[type]]: url }))
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logo Manager</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload logo variants. Changes appear immediately across the site.
        </p>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <LogoSection
            key={section.key}
            section={section}
            currentUrl={logos[section.field]}
            onUploaded={handleUploaded}
          />
        ))}
      </div>
    </div>
  )
}
