import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { FaqsTable } from "@/components/admin/faqs/faqs-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "FAQs | Admin",
}

export default async function FaqsPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {faqs.length}
        </span>
      </div>
      <FaqsTable faqs={faqs} />
    </div>
  )
}
