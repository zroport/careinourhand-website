"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { submitFeedback } from "@/actions/feedback"

const feedbackSchema = z.object({
  type: z.enum(["COMPLIMENT", "SUGGESTION", "COMPLAINT"] as const, {
    error: "Please select a feedback type",
  }),
  name: z.string().optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(20, "Please provide at least 20 characters of feedback"),
  isAnonymous: z.boolean(),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: "You must agree to the consent statement" }),
})

type FormValues = z.infer<typeof feedbackSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-destructive" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

const feedbackTypes = [
  { value: "COMPLIMENT", label: "Compliment" },
  { value: "SUGGESTION", label: "Suggestion" },
  { value: "COMPLAINT", label: "Complaint" },
] as const

export function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      isAnonymous: false,
    },
  })

  const isAnonymous = watch("isAnonymous")
  const selectedType = watch("type")

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitFeedback(data)
      if (result.success) {
        setSubmitted(true)
      } else {
        setServerError(result.error)
      }
    })
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-5">
            <span className="flex items-center justify-center size-16 rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Thank You for Your Feedback!
          </h2>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            We take all feedback seriously. If you provided contact details, we will follow up
            within 2 business days.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false)
              setServerError(null)
              reset()
            }}
            variant="outline"
            className="border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white"
          >
            Submit More Feedback
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Share Your Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Feedback form">
          <div className="space-y-5">
            {/* Feedback Type */}
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-2">
                Feedback Type{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </legend>
              <div
                className="flex flex-wrap gap-3"
                role="radiogroup"
                aria-required="true"
                aria-describedby={errors.type ? "type-error" : undefined}
              >
                {feedbackTypes.map((t) => (
                  <label
                    key={t.value}
                    className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border-2 transition-colors text-sm font-medium ${
                      selectedType === t.value
                        ? "border-[#620E87] bg-purple-50 text-[#620E87]"
                        : "border-gray-200 text-gray-700 hover:border-[#620E87]/40"
                    }`}
                  >
                    <input
                      type="radio"
                      value={t.value}
                      {...register("type")}
                      className="sr-only"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
              {errors.type && (
                <p id="type-error" className="text-sm text-destructive mt-1.5" role="alert">
                  {errors.type.message}
                </p>
              )}
            </fieldset>

            {/* Anonymous toggle */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                id="isAnonymous"
                {...register("isAnonymous")}
                aria-describedby="anonymous-hint"
              />
              <div>
                <Label htmlFor="isAnonymous" className="cursor-pointer font-medium">
                  I wish to submit this feedback anonymously
                </Label>
                <p id="anonymous-hint" className="text-xs text-gray-500 mt-0.5">
                  When checked, your name, email, and phone will not be saved.
                </p>
              </div>
            </div>

            {/* Contact fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className={isAnonymous ? "opacity-40" : ""}>
                  Your Name{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    (optional — you may submit anonymously)
                  </span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  disabled={isAnonymous}
                  {...register("name")}
                  aria-disabled={isAnonymous}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className={isAnonymous ? "opacity-40" : ""}>
                    Email{" "}
                    <span className="text-xs text-gray-500 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isAnonymous}
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-disabled={isAnonymous}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className={isAnonymous ? "opacity-40" : ""}>
                    Phone{" "}
                    <span className="text-xs text-gray-500 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0400 000 000"
                    disabled={isAnonymous}
                    {...register("phone")}
                    aria-disabled={isAnonymous}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="message">
                Your Feedback{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Textarea
                id="message"
                placeholder="Please share your feedback in detail…"
                className="min-h-[140px]"
                {...register("message")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-destructive" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                {...register("consent")}
                aria-required="true"
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />
              <div>
                <Label htmlFor="consent" className="cursor-pointer text-sm font-normal leading-snug">
                  I understand that Care In Our Hand will use this information to improve their
                  services{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                {errors.consent && (
                  <p id="consent-error" className="text-sm text-destructive mt-1" role="alert">
                    {errors.consent.message}
                  </p>
                )}
              </div>
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
              className="w-full h-10 bg-[#620E87] hover:bg-[#4a0b66] text-white border-0 font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" aria-hidden="true" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
