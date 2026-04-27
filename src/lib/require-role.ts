import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { canAccess, type Module } from "@/lib/permissions"
import { UserRole } from "@prisma/client"

export async function requireRole(module: Module) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const role = session.user.role as UserRole
  if (!canAccess(role, module)) redirect("/admin")

  return session
}
