"use client"

import { useState, useTransition } from "react"
import { UserRole } from "@prisma/client"
import { Loader2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEFAULT_PERMISSIONS, type Module } from "@/lib/permissions"
import {
  updateRolePermission,
  initializeDefaultPermissions,
  type RolePermissionRow,
} from "@/actions/admin/role-actions"

const EDITABLE_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MARKETING,
  UserRole.STAFF,
  UserRole.ACCOUNTS,
]

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MARKETING: "Marketing",
  STAFF: "Staff",
  ACCOUNTS: "Accounts",
}

const MODULE_LABELS: Record<Module, string> = {
  dashboard: "Dashboard",
  referrals: "Referrals",
  bookings: "Bookings",
  messages: "Messages",
  feedback: "Feedback",
  applications: "Applications",
  blog: "Blog Posts",
  services: "Services",
  faqs: "FAQs",
  jobs: "Job Listings",
  slides: "Home Slider",
  "page-headers": "Page Headers",
  "page-manager": "Page Manager",
  testimonials: "Testimonials",
  media: "Media Library",
  logos: "Logo Manager",
  "service-areas": "Service Areas",
  settings: "Site Settings",
  users: "User Management",
  roles: "Role Permissions",
}

type PermMap = Map<string, boolean>

function buildPermMap(dbPermissions: RolePermissionRow[]): PermMap {
  return new Map(dbPermissions.map((p) => [`${p.role}:${p.module}`, p.isEnabled]))
}

function getEffective(permMap: PermMap, role: UserRole, module: Module): boolean {
  const key = `${role}:${module}`
  if (permMap.has(key)) return permMap.get(key)!
  return DEFAULT_PERMISSIONS[module]?.includes(role) ?? false
}

interface Props {
  dbPermissions: RolePermissionRow[]
}

export function RolePermissionsGrid({ dbPermissions }: Props) {
  const [permMap, setPermMap] = useState<PermMap>(() => buildPermMap(dbPermissions))
  const [pending, setPending] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [initPending, startInitTransition] = useTransition()
  const [initError, setInitError] = useState<string | null>(null)

  const modules = Object.keys(DEFAULT_PERMISSIONS) as Module[]

  const handleToggle = async (role: UserRole, module: Module) => {
    const key = `${role}:${module}`
    const current = getEffective(permMap, role, module)
    const next = !current

    setPermMap((prev) => new Map(prev).set(key, next))
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e })
    setPending(key)

    const result = await updateRolePermission(role, module, next)
    setPending(null)

    if (!result.success) {
      setPermMap((prev) => new Map(prev).set(key, current))
      setErrors((prev) => ({ ...prev, [key]: result.error ?? "Failed" }))
    }
  }

  const handleInitialize = () => {
    setInitError(null)
    startInitTransition(async () => {
      const result = await initializeDefaultPermissions()
      if (!result.success) setInitError(result.error ?? "Failed to initialize.")
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          SUPER_ADMIN always has full access and is not configurable.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleInitialize}
          disabled={initPending}
          className="flex items-center gap-2 text-xs"
        >
          {initPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          Reset to Defaults
        </Button>
      </div>

      {initError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {initError}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 w-48">Module</th>
              {EDITABLE_ROLES.map((role) => (
                <th key={role} className="text-center px-4 py-3 font-semibold text-gray-700 min-w-[120px]">
                  {ROLE_LABELS[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map((module) => (
              <tr key={module} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {MODULE_LABELS[module]}
                </td>
                {EDITABLE_ROLES.map((role) => {
                  const key = `${role}:${module}`
                  const checked = getEffective(permMap, role, module)
                  const isPending = pending === key

                  return (
                    <td key={role} className="text-center px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggle(role, module)}
                            disabled={isPending}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#620E87] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed" />
                        </label>
                        {isPending && <Loader2 className="w-3 h-3 animate-spin text-gray-400" />}
                        {errors[key] && (
                          <p className="text-[10px] text-red-500 leading-tight">{errors[key]}</p>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
