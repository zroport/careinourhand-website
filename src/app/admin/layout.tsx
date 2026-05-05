import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopBar } from "@/components/admin/topbar"
import { headers } from "next/headers"
import { getAllowedModulesAsync } from "@/lib/permissions-server"
import { UserRole } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""

  // Pages that should show without sidebar/navbar
  const isCleanPage =
    !session?.user ||
    pathname.includes("/admin/login") ||
    pathname.includes("/admin/setup-password")

  if (isCleanPage) {
    return <>{children}</>
  }

  const role = session.user.role as UserRole
  const allowedModules = await getAllowedModulesAsync(role)

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3F8]">
      <AdminSidebar
        userName={session.user.name}
        userEmail={session.user.email}
        userRole={role}
        allowedModules={allowedModules}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopBar userName={session.user.name} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}