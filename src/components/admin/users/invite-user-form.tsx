"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { UserRole } from "@prisma/client"
import { X, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { inviteUser, type InviteFormData } from "@/actions/admin/user-actions"

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MARKETING: "Marketing",
  STAFF: "Staff",
  ACCOUNTS: "Accounts",
}

const INVITABLE_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.MARKETING,
  UserRole.STAFF,
  UserRole.ACCOUNTS,
]

const formSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(1, "Name is required"),
  role: z.nativeEnum(UserRole),
})

type FormValues = z.infer<typeof formSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600 mt-1" role="alert">{message}</p>
}

interface InviteUserFormProps {
  currentUserRole: UserRole
  onClose: () => void
  onSuccess: () => void
}

export function InviteUserForm({ currentUserRole, onClose, onSuccess }: InviteUserFormProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [inviteSent, setInviteSent] = useState(false)
  const [invitedEmail, setInvitedEmail] = useState("")

  const roles = currentUserRole === UserRole.SUPER_ADMIN
    ? [...INVITABLE_ROLES, UserRole.SUPER_ADMIN]
    : INVITABLE_ROLES

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", name: "", role: UserRole.STAFF },
  })

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await inviteUser(data as InviteFormData)
      if (!result.success) {
        setServerError(result.error)
      } else {
        setInvitedEmail(data.email)
        setInviteSent(true)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Invite User</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {inviteSent ? (
          <div className="px-6 py-8 flex flex-col items-center text-center space-y-4">
            <CheckCircle className="w-14 h-14 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Invitation Sent!</h3>
            <p className="text-sm text-gray-600">
              An invitation email has been sent to <strong>{invitedEmail}</strong>.
              They will receive a link to set up their password and access the admin panel.
            </p>
            <Button className="w-full mt-2" onClick={onSuccess}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-4">
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} className="mt-1" placeholder="Jane Smith" />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" placeholder="jane@example.com" />
              <FieldError message={errors.email?.message} />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                {...register("role")}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                ))}
              </select>
              <FieldError message={errors.role?.message} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send Invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}