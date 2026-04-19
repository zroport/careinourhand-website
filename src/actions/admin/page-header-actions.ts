"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().optional(),
  imageUrl: z.string().optional(),
})

export async function upsertPageHeader(pageSlug: string, data: unknown) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const parsed = schema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.pageHeader.upsert({
    where: { pageSlug },
    create: { pageSlug, ...parsed.data },
    update: parsed.data,
  })

  revalidatePath(`/${pageSlug}`)
  revalidatePath("/admin/page-headers")
  return { success: true }
}

export async function resetPageHeader(pageSlug: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  try {
    await prisma.pageHeader.delete({ where: { pageSlug } })
  } catch {
    // no record to delete
  }

  revalidatePath(`/${pageSlug}`)
  revalidatePath("/admin/page-headers")
  return { success: true }
}
