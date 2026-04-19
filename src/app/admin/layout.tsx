import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopBar } from "@/components/admin/topbar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // No session means this is the login page (middleware handles all other cases).
  // Render children directly so the login page gets a clean, full-screen layout.
  if (!session?.user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F3F8]">
      <AdminSidebar
        userName={session.user.name}
        userEmail={session.user.email}
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
