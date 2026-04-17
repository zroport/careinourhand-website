"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
})

export async function updateService(id: string, formData: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = schema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  const existing = await prisma.service.findUnique({ where: { slug: data.slug } })
  if (existing && existing.id !== id) {
    return { error: "A service with this slug already exists" }
  }

  await prisma.service.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      icon: data.icon || null,
      order: data.order,
      isActive: data.isActive,
    },
  })

  revalidatePath("/admin/services")
  revalidatePath("/services")
  revalidatePath(`/services/${data.slug}`)
  redirect("/admin/services")
}
