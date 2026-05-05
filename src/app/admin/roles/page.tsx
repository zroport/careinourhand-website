import { requireRole } from "@/lib/require-role"
import { getRolePermissions } from "@/actions/admin/role-actions"
import { RolePermissionsGrid } from "@/components/admin/roles/role-permissions-grid"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Role Permissions | Admin",
}

export default async function AdminRolesPage() {
  await requireRole("roles")
  const dbPermissions = await getRolePermissions()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure which modules each role can access. Changes take effect on next page load.
        </p>
      </div>
      <RolePermissionsGrid dbPermissions={dbPermissions} />
    </div>
  )
}
