import "server-only"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { type Module, DEFAULT_PERMISSIONS } from "@/lib/permissions"

export async function getAllowedModulesAsync(role: UserRole): Promise<Module[]> {
  const dbOverrides = await prisma.rolePermission.findMany({ where: { role } })
  const overrideMap = new Map(dbOverrides.map((p) => [p.module as Module, p.isEnabled]))

  return (Object.keys(DEFAULT_PERMISSIONS) as Module[]).filter((module) => {
    const dbValue = overrideMap.get(module)
    if (dbValue !== undefined) return dbValue
    return DEFAULT_PERMISSIONS[module].includes(role)
  })
}
