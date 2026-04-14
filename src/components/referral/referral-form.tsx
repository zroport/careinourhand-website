"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle, Loader2, Users, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { services } from "@/data/services"
import { submitReferral, type ReferralFormData } from "@/actions/referral"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const schema = z
  .object({
    role: z.string(),
    coordinatorName: z.string().optional(),
    coordinatorOrg: z.string().optional(),
    coordinatorPhone: z.string().optional(),
    coordinatorEmail: z.string().optional(),
    participantName: z.string().optional(),
    participantPhone: z.string().optional(),
    participantEmail: z.string().optional(),
    yourName: z.string().optional(),
    yourPhone: z.string().optional(),
    yourEmail: z.string().optional(),
    ndisNumber: z.string().optional(),
    managementType: z.string().optional(),
    servicesNeeded: z.array(z.string()),
    additionalNotes: z.string().optional(),
    consent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== "coordinator" && data.role !== "participant") {
      ctx.addIssue({ code: "custom", path: ["role"], message: "Please select your role" })
      return
    }
    if (data.role === "coordinator") {
      if (!data.coordinatorName?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorName"], message: "Coordinator name is required" })
      if (!data.coordinatorOrg?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorOrg"], message: "Organisation name is required" })
      if (!data.coordinatorPhone?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorPhone"], message: "Phone number is required" })
      if (!data.coordinatorEmail?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorEmail"], message: "Email address is required" })
      else if (!emailRegex.test(data.coordinatorEmail))
        ctx.addIssue({ code: "custom", path: ["coordinatorEmail"], message: "Invalid email address" })
      if (!data.participantName?.trim())
        ctx.addIssue({ code: "custom", path: ["participantName"], message: "Participant name is required" })
    } else {
      if (!data.yourName?.trim())
        ctx.addIssue({ code: "custom", path: ["yourName"], message: "Your name is required" })
      if (!data.yourPhone?.trim())
        ctx.addIssue({ code: "custom", path: ["yourPhone"], message: "Phone number is required" })
      if (!data.yourEmail?.trim())
        ctx.addIssue({ code: "custom", path: ["yourEmail"], message: "Email address is required" })
      else if (!emailRegex.test(data.yourEmail))
        ctx.addIssue({ code: "custom", path: ["yourEmail"], message: "Invalid email address" })
    }
    if (data.servicesNeeded.length === 0)
      ctx.addIssue({ code: "custom", path: ["servicesNeeded"], message: "Please select at least one service" })
    if (!data.consent)
      ctx.addIssue({ code: "custom", path: ["consent"], message: "You must agree to the consent statement" })
  })

type FormValues = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-destructive" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

export function ReferralForm() {
  const [submitted, setSubmitted] = useState<{ id: string } | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "",
      coordinatorName: "",
      coordinatorOrg: "",
      coordinatorPhone: "",
      coordinatorEmail: "",
      participantName: "",
      participantPhone: "",
      participantEmail: "",
      yourName: "",
      yourPhone: "",
      yourEmail: "",
      ndisNumber: "",
      managementType: "",
      servicesNeeded: [],
      additionalNotes: "",
      consent: false,
    },
  })

  const role = watch("role")
  const servicesNeeded = watch("servicesNeeded") ?? []

  function toggleService(title: string) {
    if (servicesNeeded.includes(title)) {
      setValue("servicesNeeded", servicesNeeded.filter((s) => s !== title), {
        shouldValidate: true,
      })
    } else {
      setValue("servicesNeeded", [...servicesNeeded, title], {
        shouldValidate: true,
      })
    }
  }

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitReferral(data as ReferralFormData)
      if (result.success) {
        setSubmitted({ id: result.id })
      } else {
        setServerError(result.error)
      }
    })
  }

  const handleReset = () => {
    setSubmitted(null)
    setServerError(null)
    reset()
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-5">
            <span className="flex items-center justify-center size-16 rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Referral Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Our team will review your referral and contact you within 24 business hours.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Reference:{" "}
            <span className="font-mono font-medium text-[#620E87]">
              {submitted.id.slice(0, 8).toUpperCase()}
            </span>
          </p>
          <Button
            onClick={handleReset}
            className="bg-[#620E87] hover:bg-[#4a0b66] text-white border-0"
          >
            Submit Another Referral
          </Button>
        </CardContent>
      </Card>
    )
  }

  const showCommonFields = role === "coordinator" || role === "participant"

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-gray-900">Referral Form</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Referral submission form">
          {/* Step 1: Role selection */}
          <fieldset className="mb-8">
            <legend className="text-sm font-semibold text-gray-800 mb-3">
              I am a… <span className="text-destructive" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === "coordinator"
                    ? "border-[#620E87] bg-purple-50"
                    : "border-border hover:border-[#620E87]/40 hover:bg-purple-50/40"
                }`}
              >
                <input
                  type="radio"
                  value="coordinator"
                  {...register("role")}
                  className="sr-only"
                  aria-label="I am a Support Coordinator"
                />
                <span
                  className={`flex items-center justify-center size-9 rounded-lg shrink-0 ${
                    role === "coordinator" ? "bg-[#620E87] text-white" : "bg-gray-100 text-gray-500"
                  }`}
                  aria-hidden="true"
                >
                  <Users className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Support Coordinator
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    Referring a participant
                  </span>
                </span>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  role === "participant"
                    ? "border-[#620E87] bg-purple-50"
                    : "border-border hover:border-[#620E87]/40 hover:bg-purple-50/40"
                }`}
              >
                <input
                  type="radio"
                  value="participant"
                  {...register("role")}
                  className="sr-only"
                  aria-label="I am a Participant or Family Member"
                />
                <span
                  className={`flex items-center justify-center size-9 rounded-lg shrink-0 ${
                    role === "participant"
                      ? "bg-[#620E87] text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  aria-hidden="true"
                >
                  <User className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-gray-900">
                    Participant or Family
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    Self or family referral
                  </span>
                </span>
              </label>
            </div>
            <FieldError message={errors.role?.message} />
          </fieldset>

          {/* Coordinator fields */}
          {role === "coordinator" && (
            <div className="space-y-5 mb-6">
              <h3 className="text-sm font-semibold text-[#620E87] uppercase tracking-wide border-b border-purple-100 pb-2">
                Your Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="coordinatorName">
                    Coordinator Name <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="coordinatorName"
                    placeholder="Your full name"
                    {...register("coordinatorName")}
                    aria-invalid={!!errors.coordinatorName}
                    aria-describedby={errors.coordinatorName ? "coordinatorName-error" : undefined}
                  />
                  <FieldError message={errors.coordinatorName?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coordinatorOrg">
                    Organisation Name <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="coordinatorOrg"
                    placeholder="Your organisation"
                    {...register("coordinatorOrg")}
                    aria-invalid={!!errors.coordinatorOrg}
                  />
                  <FieldError message={errors.coordinatorOrg?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coordinatorPhone">
                    Your Phone <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="coordinatorPhone"
                    type="tel"
                    placeholder="0400 000 000"
                    {...register("coordinatorPhone")}
                    aria-invalid={!!errors.coordinatorPhone}
                  />
                  <FieldError message={errors.coordinatorPhone?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="coordinatorEmail">
                    Your Email <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="coordinatorEmail"
                    type="email"
                    placeholder="you@example.com"
                    {...register("coordinatorEmail")}
                    aria-invalid={!!errors.coordinatorEmail}
                  />
                  <FieldError message={errors.coordinatorEmail?.message} />
                </div>
              </div>

              <h3 className="text-sm font-semibold text-[#620E87] uppercase tracking-wide border-b border-purple-100 pb-2 pt-2">
                Participant Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="participantName">
                    Participant Name <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="participantName"
                    placeholder="Participant's full name"
                    {...register("participantName")}
                    aria-invalid={!!errors.participantName}
                  />
                  <FieldError message={errors.participantName?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="participantPhone">Participant Phone</Label>
                  <Input
                    id="participantPhone"
                    type="tel"
                    placeholder="0400 000 000"
                    {...register("participantPhone")}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="participantEmail">Participant Email</Label>
                  <Input
                    id="participantEmail"
                    type="email"
                    placeholder="participant@example.com"
                    {...register("participantEmail")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Participant/Family fields */}
          {role === "participant" && (
            <div className="space-y-5 mb-6">
              <h3 className="text-sm font-semibold text-[#620E87] uppercase tracking-wide border-b border-purple-100 pb-2">
                Your Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="yourName">
                    Your Name <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="yourName"
                    placeholder="Your full name"
                    {...register("yourName")}
                    aria-invalid={!!errors.yourName}
                  />
                  <FieldError message={errors.yourName?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="yourPhone">
                    Phone <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="yourPhone"
                    type="tel"
                    placeholder="0400 000 000"
                    {...register("yourPhone")}
                    aria-invalid={!!errors.yourPhone}
                  />
                  <FieldError message={errors.yourPhone?.message} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="yourEmail">
                    Email <span className="text-destructive" aria-hidden="true">*</span>
                  </Label>
                  <Input
                    id="yourEmail"
                    type="email"
                    placeholder="you@example.com"
                    {...register("yourEmail")}
                    aria-invalid={!!errors.yourEmail}
                  />
                  <FieldError message={errors.yourEmail?.message} />
                </div>
              </div>
            </div>
          )}

          {/* Common fields */}
          {showCommonFields && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-[#620E87] uppercase tracking-wide border-b border-purple-100 pb-2">
                NDIS &amp; Service Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ndisNumber">NDIS Number</Label>
                  <Input
                    id="ndisNumber"
                    placeholder="430 000 000 0"
                    {...register("ndisNumber")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="managementType">NDIS Management Type</Label>
                  <Select id="managementType" {...register("managementType")}>
                    <option value="">Select management type…</option>
                    <option value="SELF_MANAGED">Self-Managed</option>
                    <option value="PLAN_MANAGED">Plan-Managed</option>
                    <option value="NDIA_MANAGED">NDIA-Managed</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  id="services-label"
                  className={errors.servicesNeeded ? "text-destructive" : ""}
                >
                  Services Needed{" "}
                  <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <div
                  role="group"
                  aria-labelledby="services-label"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  {services.map((service) => (
                    <label
                      key={service.slug}
                      className="flex items-start gap-2.5 p-3 rounded-lg border border-border hover:border-[#620E87]/30 hover:bg-purple-50/40 cursor-pointer transition-colors has-[:checked]:border-[#620E87] has-[:checked]:bg-purple-50"
                    >
                      <Checkbox
                        value={service.title}
                        checked={servicesNeeded.includes(service.title)}
                        onChange={() => toggleService(service.title)}
                        aria-label={service.title}
                        className="mt-0.5"
                      />
                      <span className="text-sm leading-tight text-gray-700">
                        {service.title}
                      </span>
                    </label>
                  ))}
                </div>
                <FieldError message={errors.servicesNeeded?.message} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information about the participant's needs, goals, or circumstances…"
                  className="min-h-[120px]"
                  {...register("additionalNotes")}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    {...register("consent")}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {role === "coordinator"
                      ? "I confirm I have the participant's consent to submit this referral"
                      : "I agree to Care In Our Hand collecting and storing my information as per the Privacy Policy"}
                    {" "}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </span>
                </label>
                <FieldError message={errors.consent?.message} />
              </div>

              {serverError && (
                <p className="text-sm text-destructive bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-[#620E87] hover:bg-[#4a0b66] text-white border-0 font-semibold text-base"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  "Submit Referral"
                )}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
