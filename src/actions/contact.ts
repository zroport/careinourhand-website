"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormData = z.infer<typeof contactSchema>

export type ContactActionResult =
  | { success: true }
  | { success: false; error: string }

export async function submitContact(data: ContactFormData): Promise<ContactActionResult> {
  try {
    const parsed = contactSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }

    const v = parsed.data
    await prisma.contactMessage.create({
      data: {
        name: v.name,
        email: v.email,
        phone: v.phone || null,
        subject: v.subject || null,
        message: v.message,
      },
    })

    return { success: true }
  } catch (err) {
    console.error("submitContact error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
