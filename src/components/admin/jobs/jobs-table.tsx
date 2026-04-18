"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, Eye, EyeOff, Briefcase, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { formatDate } from "@/lib/format-date"
import { createJob, updateJob, deleteJob, toggleJobActive, type JobFormData } from "@/actions/admin/job-actions"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"

type JobListing = {
  id: string
  title: string
  location: string
  type: string
  description: string
  requirements: string | null
  isActive: boolean
  createdAt: Date
}

interface JobsTableProps {
  jobs: JobListing[]
}

const JOB_TYPES = ["Full-time", "Part-time", "Casual", "Contract"] as const

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["Full-time", "Part-time", "Casual", "Contract"]),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-600 mt-1" role="alert">{message}</p>
}

interface JobFormModalProps {
  job?: JobListing
  onClose: () => void
  onSuccess: () => void
}

function JobFormModal({ job, onClose, onSuccess }: JobFormModalProps) {
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const isEdit = !!job

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title ?? "",
      location: job?.location ?? "Leppington, NSW",
      type: (job?.type as FormValues["type"]) ?? "Full-time",
      description: job?.description ?? "",
      requirements: job?.requirements ?? "",
    },
  })

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    const payload: JobFormData = {
      ...data,
      requirements: data.requirements || undefined,
    }
    startTransition(async () => {
      const result = isEdit
        ? await updateJob(job.id, payload)
        : await createJob(payload)
      if (result.success) {
        onSuccess()
      } else {
        setServerError(result.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 id="job-form-title" className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Job Listing" : "Add New Job"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87]"
            aria-label="Close dialog"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="job-title">
                Title <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Input
                id="job-title"
                placeholder="e.g. Support Worker — Community"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="job-location">Location</Label>
                <Input
                  id="job-location"
                  placeholder="Leppington, NSW"
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
                <FieldError message={errors.location?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="job-type">Type</Label>
                <Select id="job-type" {...register("type")}>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="job-description">
                Description <span className="text-red-500" aria-hidden="true">*</span>
              </Label>
              <Textarea
                id="job-description"
                placeholder="Describe the role and responsibilities…"
                className="min-h-[100px]"
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="job-requirements">
                Requirements{" "}
                <span className="text-xs text-gray-400 font-normal">(one per line)</span>
              </Label>
              <Textarea
                id="job-requirements"
                placeholder={"NDIS Worker Screening Check\nFirst Aid Certificate\nValid driver's licence"}
                className="min-h-[100px]"
                {...register("requirements")}
              />
            </div>

            {serverError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                {serverError}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
                    Saving…
                  </>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Add Job"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function JobsTable({ jobs }: JobsTableProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<JobListing | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggle = (job: JobListing) => {
    setTogglingId(job.id)
    startTransition(async () => {
      await toggleJobActive(job.id, job.isActive)
      setTogglingId(null)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this job listing? This cannot be undone.")) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteJob(id)
      setDeletingId(null)
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingJob(null)
  }

  return (
    <>
      {/* Header toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-[#620E87]">
            {jobs.length}
          </span>
        </div>
        <Button
          className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0 gap-2"
          onClick={() => setShowForm(true)}
          aria-label="Add new job listing"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add New Job
        </Button>
      </div>

      <DataTable headers={["Title", "Location", "Type", "Status", "Created", "Actions"]}>
        {jobs.length === 0 ? (
          <tr>
            <td colSpan={6}>
              <EmptyState
                icon={Briefcase}
                title="No job listings yet"
                description="Add your first job listing to start receiving applications."
              />
            </td>
          </tr>
        ) : (
          jobs.map((job) => (
            <DataTableRow key={job.id}>
              <DataTableCell>
                <span className="font-medium text-gray-900">{job.title}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs text-gray-600">{job.location}</span>
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs text-gray-600">{job.type}</span>
              </DataTableCell>
              <DataTableCell>
                {job.isActive ? (
                  <Badge className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                    Active
                  </Badge>
                ) : (
                  <Badge className="text-xs bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-100">
                    Hidden
                  </Badge>
                )}
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDate(job.createdAt)}
                </span>
              </DataTableCell>
              <DataTableCell>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#620E87] hover:bg-purple-50 gap-1"
                    onClick={() => { setEditingJob(job); setShowForm(true) }}
                    aria-label={`Edit ${job.title}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "gap-1",
                      job.isActive
                        ? "text-gray-500 hover:bg-gray-50"
                        : "text-green-600 hover:bg-green-50"
                    )}
                    onClick={() => handleToggle(job)}
                    disabled={togglingId === job.id}
                    aria-label={job.isActive ? `Hide ${job.title}` : `Show ${job.title}`}
                  >
                    {togglingId === job.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : job.isActive ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    {job.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 gap-1"
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    aria-label={`Delete ${job.title}`}
                  >
                    {deletingId === job.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </Button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))
        )}
      </DataTable>

      {(showForm || editingJob) && (
        <JobFormModal
          job={editingJob ?? undefined}
          onClose={closeForm}
          onSuccess={closeForm}
        />
      )}
    </>
  )
}
