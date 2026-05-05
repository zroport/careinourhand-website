import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join, extname } from "path"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const LOGO_TYPES = ["favicon", "horizontal", "vertical", "footer", "fullHeader"] as const
type LogoType = (typeof LOGO_TYPES)[number]

const LOGO_TYPE_TO_FIELD: Record<LogoType, string> = {
  favicon: "faviconUrl",
  horizontal: "horizontalLogoUrl",
  vertical: "verticalLogoUrl",
  footer: "footerLogoUrl",
  fullHeader: "fullHeaderLogoUrl",
}

const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".svg", ".ico", ".webp"])

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await request.formData()
  const logoType = formData.get("logoType") as string | null
  const file = formData.get("file") as File | null

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })
  if (!logoType || !LOGO_TYPES.includes(logoType as LogoType)) {
    return NextResponse.json({ error: "Invalid logoType" }, { status: 400 })
  }

  const ext = extname(file.name).toLowerCase()
  if (!ALLOWED_EXTS.has(ext)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: jpg, jpeg, png, svg, ico, webp" },
      { status: 400 }
    )
  }

  const filename = `${logoType}-${Date.now()}${ext}`
  const uploadDir = join(process.cwd(), "public", "uploads", "logos")
  const bytes = await file.arrayBuffer()
  await writeFile(join(uploadDir, filename), Buffer.from(bytes))

  const url = `/uploads/logos/${filename}`
  const field = LOGO_TYPE_TO_FIELD[logoType as LogoType]

  const existing = await prisma.siteLogos.findFirst({ where: { siteId: "default" } })
  if (existing) {
    await prisma.siteLogos.update({ where: { id: existing.id }, data: { [field]: url } })
  } else {
    await prisma.siteLogos.create({ data: { siteId: "default", [field]: url } })
  }

  return NextResponse.json({ url })
}
