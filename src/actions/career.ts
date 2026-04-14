"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const careerSchema = z.object({
  jobId: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  coverNote: z.string().optional(),
})

export type CareerFormData = z.infer<typeof careerSchema>

export type CareerActionResult =
  | { success: true }
  | { success: false; error: string }

export async function submitApplication(data: CareerFormData): Promise<CareerActionResult> {
  try {
    const parsed = careerSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }

    const v = parsed.data

    await prisma.jobApplication.create({
      data: {
        jobId: v.jobId || null,
        fullName: v.fullName,
        email: v.email,
        phone: v.phone,
        coverNote: v.coverNote?.trim() || null,
      },
    })

    return { success: true }
  } catch (err) {
    console.error("submitApplication error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
