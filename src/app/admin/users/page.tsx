import { requireRole } from "@/lib/require-role"
import { getUsers } from "@/actions/admin/user-actions"
import { UsersTable } from "@/components/admin/users/users-table"
import { UserRole } from "@prisma/client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "User Management | Admin",
}

export default async function AdminUsersPage() {
  const session = await requireRole("users")
  const users = await getUsers()

  return (
    <div className="max-w-7xl mx-auto">
      <UsersTable
        users={users}
        currentUserId={session.user.id}
        currentUserRole={session.user.role as UserRole}
      />
    </div>
  )
}
