"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["Full-time", "Part-time", "Casual", "Contract"]),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
})

export type JobFormData = z.infer<typeof jobSchema>

export type JobActionResult =
  | { success: true }
  | { success: false; error: string }

export async function createJob(data: JobFormData): Promise<JobActionResult> {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  try {
    const parsed = jobSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }
    await prisma.jobListing.create({ data: parsed.data })
    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return { success: true }
  } catch (err) {
    console.error("createJob error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function updateJob(id: string, data: JobFormData): Promise<JobActionResult> {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  try {
    const parsed = jobSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }
    await prisma.jobListing.update({ where: { id }, data: parsed.data })
    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return { success: true }
  } catch (err) {
    console.error("updateJob error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function deleteJob(id: string): Promise<JobActionResult> {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  try {
    await prisma.jobListing.delete({ where: { id } })
    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return { success: true }
  } catch (err) {
    console.error("deleteJob error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function toggleJobActive(id: string, currentlyActive: boolean): Promise<JobActionResult> {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  try {
    await prisma.jobListing.update({ where: { id }, data: { isActive: !currentlyActive } })
    revalidatePath("/admin/jobs")
    revalidatePath("/careers")
    return { success: true }
  } catch (err) {
    console.error("toggleJobActive error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
