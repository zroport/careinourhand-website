"use server"

import { sendEmail } from "@/lib/email"
import { invitationEmail } from "@/lib/email-templates"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { canAccess } from "@/lib/permissions"
import crypto from "crypto"

async function requireUserManagement() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")
  const role = session.user.role as UserRole
  if (!canAccess(role, "users")) redirect("/admin")
  return session
}

export type UserActionResult = { success: true } | { success: false; error: string }
export type InviteResult =
  | { success: true; setupUrl: string }
  | { success: false; error: string }

const inviteSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(1, "Name is required"),
  role: z.nativeEnum(UserRole),
})

export type InviteFormData = z.infer<typeof inviteSchema>

export async function getUsers() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function inviteUser(data: InviteFormData): Promise<InviteResult> {
  await requireUserManagement()

  const parsed = inviteSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { email, name, role } = parsed.data

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return { success: false, error: "User with that email already exists." }

    // Invalidate prior unused invites for this email
    await prisma.invitation.updateMany({
      where: { email, isUsed: false },
      data: { isUsed: true },
    })

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.invitation.create({
      data: { email, name, roleId: role, token, expiresAt },
    })

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
    const setupUrl = `${baseUrl}/setup-password?token=${token}`

    // Send invitation email
    const emailTemplate = invitationEmail({
      name,
      email,
      role: role.replace(/_/g, " "),
      setupUrl,
    })
    await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    revalidatePath("/admin/users")
    return { success: true, setupUrl }
  } catch (err) {
    console.error("inviteUser error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function toggleUserActive(
  id: string,
  currentlyActive: boolean
): Promise<UserActionResult> {
  const session = await requireUserManagement()

  if (session.user.id === id) {
    return { success: false, error: "Cannot deactivate your own account." }
  }

  try {
    await prisma.user.update({ where: { id }, data: { isActive: !currentlyActive } })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (err) {
    console.error("toggleUserActive error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function changeUserRole(
  id: string,
  role: UserRole
): Promise<UserActionResult> {
  const session = await requireUserManagement()

  if (session.user.id === id) {
    return { success: false, error: "Cannot change your own role." }
  }

  try {
    await prisma.user.update({ where: { id }, data: { role } })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (err) {
    console.error("changeUserRole error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}

export async function deleteUser(id: string): Promise<UserActionResult> {
  const session = await requireUserManagement()

  const role = session.user.role as UserRole
  if (role !== UserRole.SUPER_ADMIN) {
    return { success: false, error: "Only Super Admins can delete users." }
  }

  if (session.user.id === id) {
    return { success: false, error: "Cannot delete your own account." }
  }

  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (err) {
    console.error("deleteUser error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
