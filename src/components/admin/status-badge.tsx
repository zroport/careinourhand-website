import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-amber-100 text-amber-800 border-amber-200" },
  PENDING: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
  RECEIVED: { label: "Received", className: "bg-amber-100 text-amber-800 border-amber-200" },
  IN_REVIEW: { label: "In Review", className: "bg-blue-100 text-blue-800 border-blue-200" },
  INVESTIGATING: { label: "Investigating", className: "bg-blue-100 text-blue-800 border-blue-200" },
  CONTACTED: { label: "Contacted", className: "bg-purple-100 text-purple-800 border-purple-200" },
  CONFIRMED: { label: "Confirmed", className: "bg-purple-100 text-purple-800 border-purple-200" },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-800 border-green-200" },
  COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800 border-green-200" },
  RESOLVED: { label: "Resolved", className: "bg-green-100 text-green-800 border-green-200" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-800 border-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800 border-red-200" },
  COMPLIMENT: { label: "Compliment", className: "bg-green-100 text-green-800 border-green-200" },
  SUGGESTION: { label: "Suggestion", className: "bg-blue-100 text-blue-800 border-blue-200" },
  COMPLAINT: { label: "Complaint", className: "bg-red-100 text-red-800 border-red-200" },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-700 border-gray-200" }
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
