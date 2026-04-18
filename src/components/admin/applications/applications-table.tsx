"use client"

import { useState } from "react"
import { Eye, Briefcase, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { DetailModal, DetailField, DetailSection } from "@/components/admin/detail-modal"
import { formatRelativeDate, formatDate } from "@/lib/format-date"

type Application = {
  id: string
  fullName: string
  email: string
  phone: string
  jobId: string | null
  coverNote: string | null
  resume: string | null
  createdAt: Date
}

type JobListing = {
  id: string
  title: string
}

interface ApplicationsTableProps {
  applications: Application[]
  jobListings: JobListing[]
}

function getFileExtension(dataUri: string): string {
  const mime = dataUri.match(/^data:([^;]+)/)?.[1] ?? ""
  if (mime.includes("pdf")) return "pdf"
  if (mime.includes("wordprocessingml")) return "docx"
  if (mime.includes("msword")) return "doc"
  return "pdf"
}

function downloadResume(app: Application) {
  if (!app.resume) return
  const ext = getFileExtension(app.resume)
  const safeName = app.fullName.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "")
  const a = document.createElement("a")
  a.href = app.resume
  a.download = `${safeName}_CV.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function ApplicationsTable({ applications, jobListings }: ApplicationsTableProps) {
  const [selected, setSelected] = useState<Application | null>(null)

  const jobMap = Object.fromEntries(jobListings.map((j) => [j.id, j.title]))

  function getPosition(app: Application) {
    if (app.jobId && jobMap[app.jobId]) return jobMap[app.jobId]
    return null
  }

  return (
    <>
      <DataTable
        headers={[
          "Applicant Name",
          "Email",
          "Phone",
          "Position Applied",
          "Cover Note",
          "Date Applied",
          "CV",
          "",
        ]}
      >
        {applications.length === 0 ? (
          <tr>
            <td colSpan={8}>
              <EmptyState
                icon={Briefcase}
                title="No applications yet"
                description="Job applications will appear here when candidates apply."
              />
            </td>
          </tr>
        ) : (
          applications.map((app) => {
            const position = getPosition(app)
            return (
              <DataTableRow key={app.id}>
                <DataTableCell>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{app.fullName}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs">{app.email}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs whitespace-nowrap">{app.phone}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs">
                    {position || <span className="text-gray-400 italic">General Application</span>}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-500">
                    {app.coverNote
                      ? app.coverNote.length > 50
                        ? `${app.coverNote.slice(0, 50)}…`
                        : app.coverNote
                      : <span className="text-gray-400">—</span>}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatRelativeDate(app.createdAt)}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  {app.resume ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#620E87] hover:bg-purple-50 gap-1 whitespace-nowrap"
                      onClick={() => downloadResume(app)}
                      aria-label={`Download CV for ${app.fullName}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download CV
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </DataTableCell>
                <DataTableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#620E87] hover:bg-purple-50 gap-1 whitespace-nowrap"
                    onClick={() => setSelected(app)}
                    aria-label={`View application from ${app.fullName}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Button>
                </DataTableCell>
              </DataTableRow>
            )
          })
        )}
      </DataTable>

      <DetailModal
        title="Job Application"
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <DetailSection title="Applicant">
              <DetailField label="Full Name" value={selected.fullName} />
              <DetailField label="Email" value={selected.email} />
              <DetailField label="Phone" value={selected.phone} />
            </DetailSection>

            <DetailSection title="Application">
              <DetailField
                label="Position Applied For"
                value={getPosition(selected) || "General Application"}
              />
              <DetailField
                label="Cover Note"
                value={
                  selected.coverNote ? (
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selected.coverNote}
                    </p>
                  ) : null
                }
              />
            </DetailSection>

            <DetailSection title="Application Date">
              <DetailField label="Applied" value={formatDate(selected.createdAt)} />
            </DetailSection>

            <DetailSection title="Resume / CV">
              {selected.resume ? (
                <Button
                  size="sm"
                  className="bg-[#620E87] hover:bg-[#4a0b66] text-white border-0 gap-2"
                  onClick={() => downloadResume(selected)}
                  aria-label={`Download CV for ${selected.fullName}`}
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </Button>
              ) : (
                <p className="text-sm text-gray-400 italic">No resume uploaded</p>
              )}
            </DetailSection>
          </>
        )}
      </DetailModal>
    </>
  )
}
