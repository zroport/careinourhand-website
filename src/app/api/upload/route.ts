import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, extname } from "path"
import { prisma } from "@/lib/prisma"

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"])
const PDF_TYPES = new Set(["application/pdf"])
const IMAGE_MAX = 5 * 1024 * 1024
const PDF_MAX = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided", success: false }, { status: 400 })
    }

    const isImage = IMAGE_TYPES.has(file.type)
    const isPdf = PDF_TYPES.has(file.type)

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Invalid file type. Accepted: JPG, PNG, WebP, GIF, PDF", success: false },
        { status: 400 }
      )
    }

    if (isImage && file.size > IMAGE_MAX) {
      return NextResponse.json({ error: "Image must be under 5MB", success: false }, { status: 400 })
    }

    if (isPdf && file.size > PDF_MAX) {
      return NextResponse.json({ error: "PDF must be under 10MB", success: false }, { status: 400 })
    }

    const ext = extname(file.name).toLowerCase() || (isPdf ? ".pdf" : ".jpg")
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    const uploadDir = join(process.cwd(), "public", "uploads")

    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(join(uploadDir, unique), buffer)

    const fileUrl = `/uploads/${unique}`
    try {
      await prisma.media.create({
        data: {
          fileName: file.name,
          fileUrl,
          fileType: file.type,
          fileSize: file.size,
        },
      })
    } catch {
      // non-fatal — file is saved even if DB insert fails
    }

    return NextResponse.json({ url: fileUrl, success: true })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "Upload failed", success: false }, { status: 500 })
  }
}
