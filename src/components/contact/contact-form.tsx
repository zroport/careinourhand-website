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
import { Select } from "@/components/ui/select"
import { submitContact } from "@/actions/contact"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormValues = z.infer<typeof contactSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-destructive" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = (data: FormValues) => {
    setServerError(null)
    startTransition(async () => {
      const result = await submitContact(data)
      if (result.success) {
        setSubmitted(true)
      } else {
        setServerError(result.error)
      }
    })
  }

  const handleReset = () => {
    setSubmitted(false)
    setServerError(null)
    reset()
  }

  if (submitted) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <div className="flex justify-center mb-5">
            <span className="flex items-center justify-center size-16 rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-gray-900">Send Us a Message</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Contact form">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Name <span className="text-destructive" aria-hidden="true">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0400 000 000"
                  {...register("phone")}
                />
              </div>
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
              <Label htmlFor="subject">Subject</Label>
              <Select id="subject" {...register("subject")}>
                <option value="">Select a subject…</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Service Information">Service Information</option>
                <option value="Pricing Question">Pricing Question</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">
                Message <span className="text-destructive" aria-hidden="true">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="How can we help you?"
                className="min-h-[140px]"
                {...register("message")}
                aria-invalid={!!errors.message}
              />
              <FieldError message={errors.message?.message} />
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
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" aria-hidden="true" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
