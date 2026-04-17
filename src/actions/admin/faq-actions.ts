"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  order: z.number().int().min(0),
})

export async function createFaq(formData: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = faqSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await prisma.faq.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      order: parsed.data.order,
      isActive: true,
    },
  })

  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}

export async function updateFaq(id: string, formData: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = faqSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await prisma.faq.update({
    where: { id },
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      order: parsed.data.order,
    },
  })

  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}

export async function deleteFaq(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.faq.delete({ where: { id } })

  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}

export async function toggleFaqActive(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const faq = await prisma.faq.findUnique({ where: { id } })
  if (!faq) throw new Error("FAQ not found")

  await prisma.faq.update({
    where: { id },
    data: { isActive: !faq.isActive },
  })

  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}
