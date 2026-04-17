"use client"

import { useState, useTransition } from "react"
import { Eye, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { DetailModal, DetailField, DetailSection } from "@/components/admin/detail-modal"
import { formatRelativeDate, formatDate } from "@/lib/format-date"
import { updateReferralStatus } from "@/actions/admin/update-referral"
type ReferralStatus = "NEW" | "IN_REVIEW" | "CONTACTED" | "ACCEPTED" | "DECLINED"
type ManagementType = "SELF_MANAGED" | "PLAN_MANAGED" | "NDIA_MANAGED"

type Referral = {
  id: string
  participantName: string
  participantPhone: string | null
  participantEmail: string | null
  ndisNumber: string | null
  managementType: ManagementType | null
  coordinatorName: string | null
  coordinatorOrg: string | null
  coordinatorPhone: string | null
  coordinatorEmail: string | null
  servicesNeeded: string | null
  additionalNotes: string | null
  status: ReferralStatus
  createdAt: Date
}

const MANAGEMENT_LABELS: Record<ManagementType, string> = {
  SELF_MANAGED: "Self Managed",
  PLAN_MANAGED: "Plan Managed",
  NDIA_MANAGED: "NDIA Managed",
}

const STATUS_OPTIONS: { value: ReferralStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "NEW", label: "New" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DECLINED", label: "Declined" },
]

const STATUS_UPDATE_OPTIONS: { value: ReferralStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DECLINED", label: "Declined" },
]

interface ReferralsTableProps {
  referrals: Referral[]
}

export function ReferralsTable({ referrals }: ReferralsTableProps) {
  const [filterStatus, setFilterStatus] = useState<ReferralStatus | "ALL">("ALL")
  const [selected, setSelected] = useState<Referral | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = filterStatus === "ALL"
    ? referrals
    : referrals.filter((r) => r.status === filterStatus)

  function handleStatusChange(referralId: string, status: string) {
    startTransition(async () => {
      await updateReferralStatus(referralId, status as ReferralStatus)
      if (selected?.id === referralId) {
        setSelected((prev) => prev ? { ...prev, status: status as ReferralStatus } : null)
      }
    })
  }

  const services = selected?.servicesNeeded?.split(",").map((s) => s.trim()).filter(Boolean) ?? []

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-gray-500 font-medium" htmlFor="referral-status-filter">Status:</label>
        <Select
          id="referral-status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ReferralStatus | "ALL")}
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
          icon={Inbox}
          title="No referrals found"
          description="No referrals match the current filter."
        />
      ) : (
        <DataTable headers={["Participant", "Coordinator", "Contact", "NDIS Type", "Services", "Status", "Submitted", ""]}>
          {filtered.map((referral) => {
            const servicesArr = referral.servicesNeeded?.split(",").map((s) => s.trim()).filter(Boolean) ?? []
            const contact = referral.participantPhone || referral.participantEmail || "—"
            return (
              <DataTableRow key={referral.id}>
                <DataTableCell>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{referral.participantName}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="whitespace-nowrap">{referral.coordinatorName || <span className="text-gray-400 italic">Direct</span>}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs whitespace-nowrap">{contact}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="whitespace-nowrap">
                    {referral.managementType ? MANAGEMENT_LABELS[referral.managementType].replace(" Managed", "") : "—"}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  {servicesArr.length === 0 ? (
                    <span className="text-gray-400">—</span>
                  ) : servicesArr.length === 1 ? (
                    <span className="text-xs">{servicesArr[0]}</span>
                  ) : (
                    <span className="text-xs">{servicesArr[0]} <span className="text-gray-400">+{servicesArr.length - 1}</span></span>
                  )}
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge status={referral.status} />
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatRelativeDate(referral.createdAt)}</span>
                </DataTableCell>
                <DataTableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#620E87] hover:bg-purple-50 gap-1 whitespace-nowrap"
                    onClick={() => setSelected(referral)}
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

      {/* Detail panel */}
      <DetailModal
        title="Referral Details"
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <DetailSection title="Participant">
              <DetailField label="Full Name" value={selected.participantName} />
              <DetailField label="Phone" value={selected.participantPhone} />
              <DetailField label="Email" value={selected.participantEmail} />
              <DetailField label="NDIS Number" value={selected.ndisNumber} />
              <DetailField
                label="Management Type"
                value={selected.managementType ? MANAGEMENT_LABELS[selected.managementType] : null}
              />
            </DetailSection>

            {selected.coordinatorName && (
              <DetailSection title="Support Coordinator">
                <DetailField label="Name" value={selected.coordinatorName} />
                <DetailField label="Organisation" value={selected.coordinatorOrg} />
                <DetailField label="Phone" value={selected.coordinatorPhone} />
                <DetailField label="Email" value={selected.coordinatorEmail} />
              </DetailSection>
            )}

            <DetailSection title="Services Requested">
              <DetailField
                label="Services"
                value={
                  services.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5">
                      {services.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  ) : null
                }
              />
              <DetailField label="Additional Notes" value={selected.additionalNotes} />
            </DetailSection>

            <DetailSection title="Submission">
              <DetailField label="Date" value={formatDate(selected.createdAt)} />
              <DetailField
                label="Time"
                value={new Date(selected.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
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
