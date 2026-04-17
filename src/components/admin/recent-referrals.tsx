import Link from "next/link"
import { formatRelativeDate } from "@/lib/format-date"
import type { ReferralStatus } from "@prisma/client"

interface Referral {
  id: string
  participantName: string
  coordinatorName: string | null
  status: ReferralStatus
  createdAt: Date
}

const statusStyles: Record<ReferralStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-purple-100 text-purple-700" },
  IN_REVIEW: { label: "In Review", className: "bg-yellow-100 text-yellow-700" },
  CONTACTED: { label: "Contacted", className: "bg-blue-100 text-blue-700" },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-700" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-700" },
}

interface RecentReferralsProps {
  referrals: Referral[]
}

export function RecentReferrals({ referrals }: RecentReferralsProps) {
  return (
    <div className="glass-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Referrals</h2>
      {referrals.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No referrals yet</p>
      ) : (
        <ul className="divide-y divide-gray-100 -mx-1">
          {referrals.map((referral) => {
            const style = statusStyles[referral.status]
            return (
              <li key={referral.id} className="flex items-center justify-between gap-3 py-3 px-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {referral.participantName}
                  </p>
                  {referral.coordinatorName && (
                    <p className="text-xs text-gray-500 truncate">
                      via {referral.coordinatorName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatRelativeDate(referral.createdAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style.className}`}
                  aria-label={`Status: ${style.label}`}
                >
                  {style.label}
                </span>
              </li>
            )
          })}
        </ul>
      )}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <Link
          href="/admin/referrals"
          className="text-sm font-medium hover:underline"
          style={{ color: "#620E87" }}
        >
          View all referrals →
        </Link>
      </div>
    </div>
  )
}
