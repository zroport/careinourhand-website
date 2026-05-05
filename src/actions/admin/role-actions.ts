"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { canAccess, DEFAULT_PERMISSIONS, type Module } from "@/lib/permissions"

async function requireRolesAccess() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")
  const role = session.user.role as UserRole
  if (!canAccess(role, "roles")) redirect("/admin")
  return session
}

export type RolePermissionRow = {
  id: string
  role: UserRole
  module: string
  isEnabled: boolean
}

export async function getRolePermissions(): Promise<RolePermissionRow[]> {
  await requireRolesAccess()
  return prisma.rolePermission.findMany({ orderBy: [{ role: "asc" }, { module: "asc" }] })
}

export async function updateRolePermission(
  role: UserRole,
  module: string,
  isEnabled: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireRolesAccess()

  try {
    await prisma.rolePermission.upsert({
      where: { role_module: { role, module } },
      create: { role, module, isEnabled },
      update: { isEnabled },
    })
    revalidatePath("/admin/roles")
    return { success: true }
  } catch (err) {
    console.error("updateRolePermission error:", err)
    return { success: false, error: "Failed to update permission." }
  }
}

export async function initializeDefaultPermissions(): Promise<{ success: boolean; error?: string }> {
  await requireRolesAccess()

  const editableRoles: UserRole[] = [
    UserRole.ADMIN,
    UserRole.MARKETING,
    UserRole.STAFF,
    UserRole.ACCOUNTS,
  ]

  try {
    const rows = editableRoles.flatMap((role) =>
      (Object.entries(DEFAULT_PERMISSIONS) as [Module, UserRole[]][]).map(([module, allowed]) => ({
        role,
        module,
        isEnabled: allowed.includes(role),
      }))
    )

    await prisma.$transaction(
      rows.map((row) =>
        prisma.rolePermission.upsert({
          where: { role_module: { role: row.role, module: row.module } },
          create: row,
          update: { isEnabled: row.isEnabled },
        })
      )
    )

    revalidatePath("/admin/roles")
    return { success: true }
  } catch (err) {
    console.error("initializeDefaultPermissions error:", err)
    return { success: false, error: "Failed to initialize permissions." }
  }
}
