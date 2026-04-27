"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export type TokenValidation =
  | { valid: true; name: string | null; email: string; role: string }
  | { valid: false; error: string }

export async function validateInviteToken(token: string): Promise<TokenValidation> {
  if (!token) return { valid: false, error: "No token provided." }

  const invitation = await prisma.invitation.findUnique({ where: { token } })

  if (!invitation) return { valid: false, error: "Invalid invitation link." }
  if (invitation.isUsed) return { valid: false, error: "This invitation has already been used." }
  if (invitation.expiresAt < new Date()) return { valid: false, error: "This invitation has expired." }

  // Check user doesn't already exist
  const existing = await prisma.user.findUnique({ where: { email: invitation.email } })
  if (existing) return { valid: false, error: "An account with this email already exists." }

  return {
    valid: true,
    name: invitation.name,
    email: invitation.email,
    role: invitation.roleId,
  }
}

const setupSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type SetupResult = { success: true } | { success: false; error: string }

export async function completeSetup(data: {
  token: string
  password: string
  confirmPassword: string
}): Promise<SetupResult> {
  const parsed = setupSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { token, password } = parsed.data

  try {
    const invitation = await prisma.invitation.findUnique({ where: { token } })

    if (!invitation) return { success: false, error: "Invalid invitation link." }
    if (invitation.isUsed) return { success: false, error: "This invitation has already been used." }
    if (invitation.expiresAt < new Date()) return { success: false, error: "This invitation has expired." }

    const existing = await prisma.user.findUnique({ where: { email: invitation.email } })
    if (existing) return { success: false, error: "An account with this email already exists." }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: invitation.email,
          name: invitation.name,
          role: invitation.roleId,
          password: hashedPassword,
          isActive: true,
        },
      }),
      prisma.invitation.update({
        where: { token },
        data: { isUsed: true },
      }),
    ])

    return { success: true }
  } catch (err) {
    console.error("completeSetup error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
