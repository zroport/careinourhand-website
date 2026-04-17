import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReferralsTable } from "@/components/admin/referrals/referrals-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Referrals | Admin",
}

export default async function ReferralsPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const referrals = await prisma.referral.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
          {referrals.length}
        </span>
      </div>
      <ReferralsTable referrals={referrals} />
    </div>
  )
}
