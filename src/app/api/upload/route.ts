import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, extname } from "path"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"])
const PDF_TYPES = new Set(["application/pdf"])
const IMAGE_MAX = 10 * 1024 * 1024 // 10MB
const PDF_MAX = 10 * 1024 * 1024   // 10MB

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 })
  }

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
        { error: "Invalid file type. Allowed: jpg, png, webp, svg, pdf", success: false },
        { status: 400 }
      )
    }

    if (file.size > (isImage ? IMAGE_MAX : PDF_MAX)) {
      return NextResponse.json({ error: "File exceeds 10MB limit", success: false }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    let fileUrl: string

    if (isImage) {
      // Upload images to Cloudinary with auto-optimization
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "careinourhand",
              resource_type: "image",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"))
              resolve(result as { secure_url: string })
            }
          )
          .end(buffer)
      })
      fileUrl = result.secure_url
    } else {
      // PDFs saved locally
      const ext = extname(file.name).toLowerCase() || ".pdf"
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
      const uploadDir = join(process.cwd(), "public", "uploads")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(join(uploadDir, unique), buffer)
      fileUrl = `/uploads/${unique}`
    }

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
