"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { unlink } from "fs/promises"
import { join } from "path"

export async function deleteMedia(id: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const media = await prisma.media.findUnique({ where: { id } })
  if (!media) return { error: "Not found" }

  await prisma.media.delete({ where: { id } })

  if (media.fileUrl.startsWith("/uploads/")) {
    try {
      await unlink(join(process.cwd(), "public", media.fileUrl))
    } catch {
      // file may already be gone
    }
  }

  revalidatePath("/admin/media")
  return { success: true }
}

export async function updateMediaAlt(id: string, altText: string) {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  await prisma.media.update({ where: { id }, data: { altText } })
  revalidatePath("/admin/media")
  return { success: true }
}
