"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const careerSchema = z.object({
  jobId: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  coverNote: z.string().optional(),
  // Temporary: stored as base64 data URI until MinIO file storage is configured
  resume: z.string().min(1, "Resume is required"),
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
        resume: v.resume,
      },
    })

    return { success: true }
  } catch (err) {
    console.error("submitApplication error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
