"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { FeedbackStatus } from "@prisma/client"

export async function updateFeedbackStatus(feedbackId: string, status: FeedbackStatus) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.feedback.update({
    where: { id: feedbackId },
    data: { status },
  })

  revalidatePath("/admin/feedback")
  revalidatePath("/admin")
}
