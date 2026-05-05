"use client"

import { useState, useTransition } from "react"
import { UserPlus, UserCheck, UserX, ShieldCheck, Loader2, Trash2 } from "lucide-react"
import { UserRole } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { InviteUserForm } from "@/components/admin/users/invite-user-form"
import { toggleUserActive, changeUserRole, deleteUser } from "@/actions/admin/user-actions"
import { formatDate } from "@/lib/format-date"

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MARKETING: "Marketing",
  STAFF: "Staff",
  ACCOUNTS: "Accounts",
}

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800",
  ADMIN: "bg-blue-100 text-blue-800",
  MARKETING: "bg-green-100 text-green-800",
  STAFF: "bg-yellow-100 text-yellow-800",
  ACCOUNTS: "bg-orange-100 text-orange-800",
}

type UserRow = {
  id: string
  name: string | null
  email: string
  role: UserRole
  isActive: boolean
  createdAt: Date
}

interface UsersTableProps {
  users: UserRow[]
  currentUserId: string
  currentUserRole: UserRole
}

function RoleSelect({
  userId,
  currentRole,
  currentUserRole,
  disabled,
}: {
  userId: string
  currentRole: UserRole
  currentUserRole: UserRole
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const roles =
    currentUserRole === UserRole.SUPER_ADMIN
      ? Object.values(UserRole)
      : Object.values(UserRole).filter((r) => r !== UserRole.SUPER_ADMIN)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole
    setError(null)
    startTransition(async () => {
      const result = await changeUserRole(userId, role)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <div>
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={disabled || isPending}
        className="text-xs rounded border border-input bg-background px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {roles.map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function ToggleActiveButton({
  userId,
  isActive,
  disabled,
}: {
  userId: string
  isActive: boolean
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleToggle = () => {
    setError(null)
    startTransition(async () => {
      const result = await toggleUserActive(userId, isActive)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={disabled || isPending}
        className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        title={isActive ? "Deactivate user" : "Activate user"}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isActive ? (
          <UserX className="w-3.5 h-3.5 text-red-500" />
        ) : (
          <UserCheck className="w-3.5 h-3.5 text-green-600" />
        )}
        {isActive ? "Deactivate" : "Activate"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function TerminateButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await deleteUser(userId)
      if (!result.success) {
        setError(result.error)
        setConfirming(false)
      }
    })
  }

  return (
    <div>
      {confirming ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-red-600 font-medium">Sure?</span>
          <button
            onClick={handleClick}
            disabled={isPending}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded border border-red-500 bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes, delete"}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="text-xs px-2 py-1 rounded border hover:bg-gray-50 transition-colors text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
          title="Permanently delete user"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Terminate
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

export function UsersTable({ users, currentUserId, currentUserRole }: UsersTableProps) {
  const [showInvite, setShowInvite] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} user{users.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No users yet"
          description="Invite team members to give them admin access."
        />
      ) : (
        <DataTable headers={["Name / Email", "Role", "Status", "Joined", "Actions"]}>
          {users.map((user) => {
            const isSelf = user.id === currentUserId
            return (
              <DataTableRow key={user.id}>
                <DataTableCell>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {user.name ?? "—"}
                      {isSelf && (
                        <span className="ml-2 text-xs text-gray-400 font-normal">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </DataTableCell>
                <DataTableCell>
                  {isSelf ? (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  ) : (
                    <RoleSelect
                      userId={user.id}
                      currentRole={user.role}
                      currentUserRole={currentUserRole}
                      disabled={isSelf}
                    />
                  )}
                </DataTableCell>
                <DataTableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                </DataTableCell>
                <DataTableCell>
                  <div className="flex flex-col gap-1.5">
                    {!isSelf && (
                      <ToggleActiveButton
                        userId={user.id}
                        isActive={user.isActive}
                        disabled={isSelf}
                      />
                    )}
                    {!isSelf && currentUserRole === UserRole.SUPER_ADMIN && (
                      <TerminateButton userId={user.id} />
                    )}
                  </div>
                </DataTableCell>
              </DataTableRow>
            )
          })}
        </DataTable>
      )}

      {showInvite && (
        <InviteUserForm
          currentUserRole={currentUserRole}
          onClose={() => setShowInvite(false)}
          onSuccess={() => setShowInvite(false)}
        />
      )}
    </div>
  )
}
