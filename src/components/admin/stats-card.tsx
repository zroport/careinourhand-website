import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  count: number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  href: string
}

export function StatsCard({
  label,
  count,
  icon: Icon,
  iconBg,
  iconColor,
  href,
}: StatsCardProps) {
  return (
    <div className="glass-card p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-4xl font-bold text-gray-900">{count}</p>
          <p className="text-sm text-gray-500 mt-1">{label}</p>
        </div>
        <div
          className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", iconBg)}
          aria-hidden="true"
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
      <Link
        href={href}
        className="text-sm font-medium hover:underline transition-colors"
        style={{ color: "#620E87" }}
        aria-label={`View all ${label.toLowerCase()}`}
      >
        View all →
      </Link>
    </div>
  )
}
