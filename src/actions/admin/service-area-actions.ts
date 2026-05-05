"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

const areaSchema = z.object({
  areaName: z.string().min(1, "Area name required").max(100),
  order: z.coerce.number().int().default(0),
})

async function requireAuth() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")
}

export async function getServiceAreas() {
  return prisma.serviceArea.findMany({ orderBy: { order: "asc" } })
}

export async function getActiveServiceAreas() {
  return prisma.serviceArea.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })
}

export async function createServiceArea(data: unknown) {
  await requireAuth()
  const parsed = areaSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  await prisma.serviceArea.create({ data: parsed.data })
  revalidatePath("/admin/service-areas")
  revalidatePath("/")
}

export async function updateServiceArea(id: string, data: unknown) {
  await requireAuth()
  const parsed = areaSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  await prisma.serviceArea.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/service-areas")
  revalidatePath("/")
}

export async function toggleServiceAreaActive(id: string) {
  await requireAuth()
  const area = await prisma.serviceArea.findUnique({ where: { id } })
  if (!area) return { error: "Not found" }
  await prisma.serviceArea.update({ where: { id }, data: { isActive: !area.isActive } })
  revalidatePath("/admin/service-areas")
  revalidatePath("/")
}

export async function deleteServiceArea(id: string) {
  await requireAuth()
  await prisma.serviceArea.delete({ where: { id } })
  revalidatePath("/admin/service-areas")
  revalidatePath("/")
}
