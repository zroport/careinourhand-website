"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Upload, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { submitApplication } from "@/actions/career"

export type JobOption = {
  id: string
  title: string
}

const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const MAX_BYTES = 5 * 1024 * 1024

const schema = z.object({
  jobId: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
  coverNote: z.string().optional(),
  resume: z.string().min(1, "Please upload your resume"),
  consent: z.boolean().refine((v) => v === true, {
    message: "You must agree to the privacy policy",
  }),
})

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-red-600" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

interface ApplyModalProps {
  open: boolean
  onClose: () => void
  jobs: JobOption[]
  defaultJobId?: string
  defaultJobTitle?: string
}

export function ApplyModal({ open, onClose, jobs, defaultJobId, defaultJobTitle }: ApplyModalProps) {
  const [submitted, setSubmitted] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [fileError, setFileError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const modalTitle = defaultJobId
    ? `Apply for ${defaultJobTitle ?? "Position"}`
    : "General Application"

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobId: defaultJobId ?? "",
      fullName: "",
      email: "",
      phone: "",
      coverNote: "",
      resume: "",
      consent: false,
    },
  })

  // Reset form state each time the modal opens with possibly a new job
  React.useEffect(() => {
    if (open) {
      reset({
        jobId: defaultJobId ?? "",
        fullName: "",
        email: "",
        phone: "",
        coverNote: "",
        resume: "",
        consent: false,
      })
      setFileName(null)
      setFileError(null)
      setServerError(null)
      setSubmitted(false)
    }
  }, [open, defaultJobId, reset])

  const processFile = (file: File) => {
    setFileError(null)
    if (!ACCEPTED_MIME.includes(file.type)) {
      setFileError("Only PDF, DOC, or DOCX files are accepted")
      return
    }
    if (file.size > MAX_BYTES) {
      setFileError("File must be under 5MB")
      return
    }
    // Temporary: convert to base64 data URI for DB storage until MinIO is set up
    const reader = new FileReader()
    reader.onload = () => {
      setValue("resume", reader.result as string, { shouldValidate: true })
      setFileName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const removeFile = () => {
    setValue("resume", "", { shouldValidate: false })
    setFileName(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitApplication({
        jobId: data.jobId || undefined,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        coverNote: data.coverNote,
        resume: data.resume,
      })
      if (result.success) {
        setSubmitted(true)
      } else {
        setServerError(result.error)
      }
    })
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogPrimitive.Portal>
        {/* Backdrop */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 duration-200" />

        {/* Modal — full screen on mobile, centered card on desktop */}
        <DialogPrimitive.Content
          aria-labelledby="apply-modal-title"
          className={cn(
            "fixed inset-0 z-50 bg-white overflow-y-auto",
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
            "sm:w-full sm:max-w-lg sm:max-h-[92vh] sm:rounded-2xl sm:shadow-2xl sm:overflow-y-auto",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            "sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95",
            "duration-200"
          )}
        >
          {submitted ? (
            <SuccessState onClose={onClose} />
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5 bg-white border-b border-gray-100">
                <div>
                  <DialogPrimitive.Title
                    id="apply-modal-title"
                    className="text-lg font-bold text-gray-900"
                  >
                    {modalTitle}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm text-gray-500 mt-0.5">
                    Fill out the form below and we&apos;ll be in touch.
                  </DialogPrimitive.Description>
                </div>
                <DialogPrimitive.Close asChild>
                  <button
                    className="mt-0.5 rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#620E87] shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </DialogPrimitive.Close>
              </div>

              {/* Form body */}
              <div className="px-6 py-6">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-label="Job application form"
                  className="space-y-5"
                >
                  {/* Position */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-jobId">Which Position</Label>
                    <Select id="modal-jobId" {...register("jobId")}>
                      <option value="">General Application</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-fullName">
                      Full Name{" "}
                      <span className="text-red-500" aria-hidden="true">*</span>
                    </Label>
                    <Input
                      id="modal-fullName"
                      placeholder="Your full name"
                      {...register("fullName")}
                      aria-invalid={!!errors.fullName}
                    />
                    <FieldError message={errors.fullName?.message} />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="modal-email">
                        Email{" "}
                        <span className="text-red-500" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="modal-email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="modal-phone">
                        Phone{" "}
                        <span className="text-red-500" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="modal-phone"
                        type="tel"
                        placeholder="0400 000 000"
                        {...register("phone")}
                        aria-invalid={!!errors.phone}
                      />
                      <FieldError message={errors.phone?.message} />
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-coverNote">
                      Cover Note{" "}
                      <span className="text-xs text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="modal-coverNote"
                      placeholder="Tell us briefly why you'd be a great fit…"
                      className="min-h-[100px]"
                      {...register("coverNote")}
                    />
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-1.5">
                    <Label>
                      Resume / CV{" "}
                      <span className="text-red-500" aria-hidden="true">*</span>
                    </Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      id="modal-resume-input"
                      aria-label="Upload your resume"
                      onChange={onFileChange}
                    />
                    {fileName ? (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#89C541]/50 bg-green-50">
                        <CheckCircle className="size-5 text-[#89C541] shrink-0" aria-hidden="true" />
                        <span className="text-sm text-gray-700 flex-1 truncate min-w-0">{fileName}</span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors underline shrink-0"
                          aria-label="Remove uploaded file"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="modal-resume-input"
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-8 rounded-xl cursor-pointer transition-colors",
                          "border-2 border-dashed border-[#620E87]/30 hover:border-[#620E87]/60 hover:bg-purple-50/50",
                          isDragging && "border-[#620E87] bg-purple-50"
                        )}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                      >
                        <Upload className="size-7 text-[#620E87]/50" aria-hidden="true" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (max 5MB)</p>
                        </div>
                      </label>
                    )}
                    {fileError && (
                      <p className="text-sm text-red-600" role="alert">{fileError}</p>
                    )}
                    <FieldError message={errors.resume?.message} />
                  </div>

                  {/* Consent */}
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="modal-consent"
                        {...register("consent")}
                        aria-invalid={!!errors.consent}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor="modal-consent"
                        className="text-sm text-gray-600 cursor-pointer leading-snug"
                      >
                        I agree to Care In Our Hand storing my application data as per the{" "}
                        <a
                          href="/privacy-policy"
                          className="text-[#620E87] underline hover:no-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <FieldError message={errors.consent?.message} />
                  </div>

                  {serverError && (
                    <p
                      className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
                      role="alert"
                    >
                      {serverError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
                        Submitting…
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[420px]">
      <div className="flex items-center justify-center size-20 rounded-full bg-green-100 mb-6">
        <CheckCircle className="size-10 text-[#89C541]" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
      <p className="text-gray-500 max-w-sm leading-relaxed">
        Thank you for your interest in joining Care In Our Hand. We&apos;ll review your application
        and be in touch within 5 business days.
      </p>
      <Button
        onClick={onClose}
        className="mt-8 bg-[#620E87] hover:bg-[#4a0b66] text-white border-0 font-semibold"
      >
        Close
      </Button>
    </div>
  )
}
