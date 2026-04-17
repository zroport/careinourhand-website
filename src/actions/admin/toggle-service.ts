"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleServiceActive(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const service = await prisma.service.findUnique({ where: { id } })
  if (!service) throw new Error("Service not found")

  await prisma.service.update({
    where: { id },
    data: { isActive: !service.isActive },
  })

  revalidatePath("/admin/services")
  revalidatePath("/services")
}
