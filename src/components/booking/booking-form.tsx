"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { services } from "@/data/services"
import { submitBooking } from "@/actions/booking"

const bookingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  serviceType: z.string().min(1, "Please select a service"),
  preferredDate: z
    .string()
    .min(1, "Please select a date")
    .refine((dateStr) => {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, "Date must be today or in the future"),
  preferredTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "You must agree to the Terms of Service"),
})

type FormValues = z.infer<typeof bookingSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-destructive" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 8; h <= 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 17 && m > 0) break
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
      const period = h >= 12 ? "PM" : "AM"
      const minuteStr = m === 0 ? "00" : "30"
      slots.push(`${hour12}:${minuteStr} ${period}`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

// Min date string for the date picker (today)
function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function BookingForm() {
  const [submitted, setSubmitted] = useState<{ id: string; email: string } | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      serviceType: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
      consent: false,
    },
  })

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitBooking(data)
      if (result.success) {
        setSubmitted({ id: result.id, email: result.email })
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
      <Card className="max-w-2xl mx-auto glass-card">
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-5">
            <span className="flex items-center justify-center size-16 rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Appointment Request Received!
          </h2>
          <p className="text-gray-600 mb-1">
            We&apos;ll confirm your booking within 24 hours. You&apos;ll receive a confirmation at{" "}
            <span className="font-medium text-[#620E87]">{submitted.email}</span>.
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
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-gray-900">Booking Form</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Appointment booking form">
          <div className="space-y-5">
            {/* Personal details */}
            <h3 className="text-sm font-semibold text-[#620E87] uppercase tracking-wide border-b border-purple-100 pb-2">
              Your Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Your full name"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                />
                <FieldError message={errors.fullName?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0400 000 000"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
                <FieldError message={errors.phone?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                <FieldError message={errors.email?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">
                  Address <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Your address"
                  {...register("address")}
                  aria-invalid={!!errors.address}
                />
                <FieldError message={errors.address?.message} />
              </div>
            </div>

            {/* Service & scheduling */}
            <h3 className="text-sm font-semibold text-[#620E87] uppercase tracking-wide border-b border-purple-100 pb-2 pt-2">
              Service &amp; Scheduling
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="serviceType">
                Select Service <span className="text-destructive" aria-hidden="true">*</span>
              </Label>
              <Select
                id="serviceType"
                {...register("serviceType")}
                aria-invalid={!!errors.serviceType}
              >
                <option value="">Choose a service…</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.title}>
                    {service.title}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.serviceType?.message} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="preferredDate">
                  Preferred Date <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={getTodayString()}
                  {...register("preferredDate")}
                  aria-invalid={!!errors.preferredDate}
                />
                <FieldError message={errors.preferredDate?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="preferredTime">
                  Preferred Time <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Select
                  id="preferredTime"
                  {...register("preferredTime")}
                  aria-invalid={!!errors.preferredTime}
                >
                  <option value="">Choose a time…</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Select>
                <FieldError message={errors.preferredTime?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Booking Notes</Label>
              <Textarea
                id="notes"
                placeholder="Tell us anything we should know before your appointment"
                className="min-h-[100px]"
                {...register("notes")}
              />
            </div>

            {/* Consent */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  {...register("consent")}
                  aria-invalid={!!errors.consent}
                  className="mt-0.5"
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to Care In Our Hand&apos;s{" "}
                  <Link href="#" className="text-[#620E87] underline underline-offset-2 hover:text-[#4a0b66]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-[#620E87] underline underline-offset-2 hover:text-[#4a0b66]">
                    Privacy Policy
                  </Link>
                  {" "}
                  <span className="text-destructive" aria-hidden="true">*</span>
                </span>
              </label>
              <FieldError message={errors.consent?.message} />
            </div>

            {serverError && (
              <p
                className="text-sm text-destructive bg-red-50 border border-red-200 rounded-lg p-3"
                role="alert"
              >
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
                "Request Appointment"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
