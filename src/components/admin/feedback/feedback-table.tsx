"use client"

import { useState, useTransition } from "react"
import { Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { DetailModal, DetailField, DetailSection } from "@/components/admin/detail-modal"
import { formatRelativeDate, formatDate } from "@/lib/format-date"
import { updateFeedbackStatus } from "@/actions/admin/update-feedback"
import type { FeedbackType, FeedbackStatus } from "@prisma/client"

type FeedbackItem = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  type: FeedbackType
  message: string
  isAnonymous: boolean
  status: FeedbackStatus
  createdAt: Date
}

const TYPE_OPTIONS: { value: FeedbackType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Types" },
  { value: "COMPLIMENT", label: "Compliment" },
  { value: "SUGGESTION", label: "Suggestion" },
  { value: "COMPLAINT", label: "Complaint" },
]

const STATUS_FILTER_OPTIONS: { value: FeedbackStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "RECEIVED", label: "Received" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "RESOLVED", label: "Resolved" },
]

const STATUS_UPDATE_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: "RECEIVED", label: "Received" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "RESOLVED", label: "Resolved" },
]

interface FeedbackTableProps {
  items: FeedbackItem[]
}

export function FeedbackTable({ items }: FeedbackTableProps) {
  const [typeFilter, setTypeFilter] = useState<FeedbackType | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "ALL">("ALL")
  const [selected, setSelected] = useState<FeedbackItem | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = items.filter((item) => {
    if (typeFilter !== "ALL" && item.type !== typeFilter) return false
    if (statusFilter !== "ALL" && item.status !== statusFilter) return false
    return true
  })

  function handleStatusChange(feedbackId: string, status: string) {
    startTransition(async () => {
      await updateFeedbackStatus(feedbackId, status as FeedbackStatus)
      if (selected?.id === feedbackId) {
        setSelected((prev) => prev ? { ...prev, status: status as FeedbackStatus } : null)
      }
    })
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-gray-500 font-medium" htmlFor="feedback-type-filter">Type:</label>
        <Select
          id="feedback-type-filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as FeedbackType | "ALL")}
          className="w-40"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <label className="text-sm text-gray-500 font-medium" htmlFor="feedback-status-filter">Status:</label>
        <Select
          id="feedback-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | "ALL")}
          className="w-44"
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <span className="text-sm text-gray-400">{filtered.length} record{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No feedback found"
          description="No feedback matches the current filters."
        />
      ) : (
        <DataTable headers={["Type", "Name", "Contact", "Message", "Status", "Submitted", ""]}>
          {filtered.map((item) => {
            const contact = item.isAnonymous ? "Anonymous" : (item.email || item.phone || "—")
            return (
              <DataTableRow key={item.id}>
                <DataTableCell>
                  <StatusBadge status={item.type} />
                </DataTableCell>
                <DataTableCell>
                  <span className="whitespace-nowrap font-medium">
                    {item.isAnonymous ? <span className="text-gray-400 italic">Anonymous</span> : (item.name || "—")}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs">{contact}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-500">
                    {item.message.length > 50 ? `${item.message.slice(0, 50)}…` : item.message}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={item.status} />
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatRelativeDate(item.createdAt)}</span>
                </DataTableCell>
                <DataTableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#620E87] hover:bg-purple-50 gap-1 whitespace-nowrap"
                    onClick={() => setSelected(item)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </DataTableCell>
              </DataTableRow>
            )
          })}
        </DataTable>
      )}

      <DetailModal
        title="Feedback Details"
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <DetailSection title="Feedback">
              <DetailField label="Type" value={<StatusBadge status={selected.type} />} />
              <DetailField
                label="Submitted By"
                value={selected.isAnonymous ? "Anonymous submission" : (selected.name || "—")}
              />
              <DetailField
                label="Message"
                value={<p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{selected.message}</p>}
              />
            </DetailSection>

            {!selected.isAnonymous && (
              <DetailSection title="Contact Details">
                <DetailField label="Email" value={selected.email} />
                <DetailField label="Phone" value={selected.phone} />
              </DetailSection>
            )}

            <DetailSection title="Submission">
              <DetailField label="Date" value={formatDate(selected.createdAt)} />
              <DetailField
                label="Anonymous"
                value={selected.isAnonymous ? "Yes" : "No"}
              />
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
