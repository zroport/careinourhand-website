"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function markMessageRead(messageId: string, isRead: boolean) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead },
  })

  revalidatePath("/admin/messages")
  revalidatePath("/admin")
}
