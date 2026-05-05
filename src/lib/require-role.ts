import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { type Module } from "@/lib/permissions"
import { getAllowedModulesAsync } from "@/lib/permissions-server"
import { UserRole } from "@prisma/client"

export async function requireRole(module: Module) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const role = session.user.role as UserRole
  const allowed = await getAllowedModulesAsync(role)
  if (!allowed.includes(module)) redirect("/admin")

  return session
}
