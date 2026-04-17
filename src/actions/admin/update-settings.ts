"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const settingsSchema = z.record(z.string(), z.string())

export async function updateSettings(settings: Record<string, string>) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = settingsSchema.safeParse(settings)
  if (!parsed.success) {
    return { error: "Invalid settings data" }
  }

  await Promise.all(
    Object.entries(parsed.data).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  )

  revalidatePath("/admin/settings")
  return { success: true }
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
})

export async function updatePassword(formData: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = passwordSchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { currentPassword, newPassword, confirmPassword } = parsed.data

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  })

  if (!user?.password) {
    return { error: "User not found" }
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    return { error: "Current password is incorrect" }
  }

  const hashed = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  })

  return { success: true }
}
