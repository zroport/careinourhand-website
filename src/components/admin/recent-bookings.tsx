import Link from "next/link"
import { formatDate, formatRelativeDate } from "@/lib/format-date"
type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

interface Booking {
  id: string
  fullName: string
  serviceType: string
  preferredDate: Date
  status: BookingStatus
  createdAt: Date
}

const statusStyles: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700" },
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="glass-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No bookings yet</p>
      ) : (
        <ul className="divide-y divide-gray-100 -mx-1">
          {bookings.map((booking) => {
            const style = statusStyles[booking.status]
            return (
              <li key={booking.id} className="flex items-center justify-between gap-3 py-3 px-1">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {booking.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{booking.serviceType}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(booking.preferredDate)} · {formatRelativeDate(booking.createdAt)}
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
          href="/admin/bookings"
          className="text-sm font-medium hover:underline"
          style={{ color: "#620E87" }}
        >
          View all bookings →
        </Link>
      </div>
    </div>
  )
}
