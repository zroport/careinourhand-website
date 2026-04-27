"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendEmail, adminEmail } from "@/lib/email"
import { newFeedbackAdmin } from "@/lib/email-templates"
type FeedbackType = "COMPLIMENT" | "SUGGESTION" | "COMPLAINT"

const feedbackSchema = z.object({
  type: z.enum(["COMPLIMENT", "SUGGESTION", "COMPLAINT"] as const, {
    error: "Please select a feedback type",
  }),
  name: z.string().optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(20, "Please provide at least 20 characters of feedback"),
  isAnonymous: z.boolean().default(false),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to the consent statement" }),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>

export type FeedbackActionResult =
  | { success: true }
  | { success: false; error: string }

export async function submitFeedback(data: FeedbackFormData): Promise<FeedbackActionResult> {
  try {
    const parsed = feedbackSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }

    const v = parsed.data

    await prisma.feedback.create({
      data: {
        type: v.type as FeedbackType,
        message: v.message,
        isAnonymous: v.isAnonymous,
        name: v.isAnonymous ? null : (v.name?.trim() || null),
        email: v.isAnonymous ? null : (v.email?.trim() || null),
        phone: v.isAnonymous ? null : (v.phone?.trim() || null),
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

    await sendEmail({
      to: adminEmail(),
      ...newFeedbackAdmin({
        type: v.type,
        name: v.isAnonymous ? null : v.name,
        email: v.isAnonymous ? null : v.email,
        message: v.message,
        isAnonymous: v.isAnonymous,
        adminUrl: `${baseUrl}/admin/feedback`,
      }),
    })

    return { success: true }
  } catch (err) {
    console.error("submitFeedback error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
