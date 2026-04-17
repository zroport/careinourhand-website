import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MessagesTable } from "@/components/admin/messages/messages-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Messages | Admin",
}

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        {unreadCount > 0 ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {unreadCount} unread
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            {messages.length}
          </span>
        )}
      </div>
      <MessagesTable messages={messages} />
    </div>
  )
}
