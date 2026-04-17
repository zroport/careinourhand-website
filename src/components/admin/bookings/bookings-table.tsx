"use client"

import { useState, useTransition } from "react"
import { Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { DetailModal, DetailField, DetailSection } from "@/components/admin/detail-modal"
import { formatRelativeDate, formatDate } from "@/lib/format-date"
import { updateBookingStatus } from "@/actions/admin/update-booking"
import type { BookingStatus } from "@prisma/client"

type Booking = {
  id: string
  fullName: string
  email: string
  phone: string
  address: string | null
  serviceType: string
  preferredDate: Date
  preferredTime: string
  notes: string | null
  status: BookingStatus
  createdAt: Date
}

const STATUS_OPTIONS: { value: BookingStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
]

const STATUS_UPDATE_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
]

interface BookingsTableProps {
  bookings: Booking[]
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const [filterStatus, setFilterStatus] = useState<BookingStatus | "ALL">("ALL")
  const [selected, setSelected] = useState<Booking | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = filterStatus === "ALL"
    ? bookings
    : bookings.filter((b) => b.status === filterStatus)

  function handleStatusChange(bookingId: string, status: string) {
    startTransition(async () => {
      await updateBookingStatus(bookingId, status as BookingStatus)
      if (selected?.id === bookingId) {
        setSelected((prev) => prev ? { ...prev, status: status as BookingStatus } : null)
      }
    })
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-gray-500 font-medium" htmlFor="booking-status-filter">Status:</label>
        <Select
          id="booking-status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as BookingStatus | "ALL")}
          className="w-44"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <span className="text-sm text-gray-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No bookings found"
          description="No bookings match the current filter."
        />
      ) : (
        <DataTable headers={["Client Name", "Email", "Phone", "Service", "Preferred Date", "Time", "Status", "Submitted", ""]}>
          {filtered.map((booking) => (
            <DataTableRow key={booking.id}>
              <DataTableCell>
                <span className="font-medium text-gray-900 whitespace-nowrap">{booking.fullName}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs">{booking.email}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs whitespace-nowrap">{booking.phone}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs">{booking.serviceType}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs whitespace-nowrap">{formatDate(booking.preferredDate)}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs whitespace-nowrap">{booking.preferredTime}</span>
              </DataTableCell>
              <DataTableCell>
                <StatusBadge status={booking.status} />
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs text-gray-400 whitespace-nowrap">{formatRelativeDate(booking.createdAt)}</span>
              </DataTableCell>
              <DataTableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-[#620E87] hover:bg-purple-50 gap-1 whitespace-nowrap"
                  onClick={() => setSelected(booking)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}

      <DetailModal
        title="Booking Details"
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <DetailSection title="Client Information">
              <DetailField label="Full Name" value={selected.fullName} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.phone} />
              <DetailField label="Address" value={selected.address} />
            </DetailSection>

            <DetailSection title="Booking Details">
              <DetailField label="Service Requested" value={selected.serviceType} />
              <DetailField label="Preferred Date" value={formatDate(selected.preferredDate)} />
              <DetailField label="Preferred Time" value={selected.preferredTime} />
              <DetailField label="Notes" value={selected.notes} />
            </DetailSection>

            <DetailSection title="Submission">
              <DetailField label="Submitted" value={formatDate(selected.createdAt)} />
            </DetailSection>

            <DetailSection title="Status">
              <DetailField label="Current Status" value={<StatusBadge status={selected.status} />} />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Update Status</p>
                <Select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  disabled={isPending}
                  className="w-full"
                >
                  {STATUS_UPDATE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
            </DetailSection>
          </>
        )}
      </DetailModal>
    </>
  )
}
