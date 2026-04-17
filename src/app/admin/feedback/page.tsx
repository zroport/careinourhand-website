import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FeedbackTable } from "@/components/admin/feedback/feedback-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Feedback | Admin",
}

export default async function FeedbackPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const items = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Feedback &amp; Complaints</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {items.length}
        </span>
      </div>
      <FeedbackTable items={items} />
    </div>
  )
}
