"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
})

export async function createSlide(data: unknown) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.heroSlide.create({ data: parsed.data })
  revalidatePath("/admin/slides")
  revalidatePath("/")
  return { success: true }
}

export async function updateSlide(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.heroSlide.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/slides")
  revalidatePath("/")
  return { success: true }
}

export async function deleteSlide(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const slide = await prisma.heroSlide.findUnique({ where: { id } })
  if (!slide) return { error: "Slide not found" }

  await prisma.heroSlide.delete({ where: { id } })

  if (slide.imageUrl?.startsWith("/uploads/")) {
    try {
      const filePath = join(process.cwd(), "public", slide.imageUrl)
      await unlink(filePath)
    } catch {
      // file may not exist
    }
  }

  revalidatePath("/admin/slides")
  revalidatePath("/")
  return { success: true }
}

export async function reorderSlides(ids: string[]) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  await Promise.all(
    ids.map((id, order) => prisma.heroSlide.update({ where: { id }, data: { order } }))
  )

  revalidatePath("/admin/slides")
  revalidatePath("/")
  return { success: true }
}
