"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
})

function revalidate() {
  revalidatePath("/admin/testimonials")
  revalidatePath("/")
}

export async function createTestimonial(data: unknown) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.testimonial.create({ data: parsed.data })
  revalidate()
  return { success: true }
}

export async function updateTestimonial(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.testimonial.update({ where: { id }, data: parsed.data })
  revalidate()
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  await prisma.testimonial.delete({ where: { id } })
  revalidate()
  return { success: true }
}

export async function toggleTestimonial(id: string, isActive: boolean) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  await prisma.testimonial.update({ where: { id }, data: { isActive } })
  revalidate()
  return { success: true }
}
