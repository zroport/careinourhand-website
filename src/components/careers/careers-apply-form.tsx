"use client"

import { forwardRef, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle, Loader2, Send, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { submitApplication } from "@/actions/career"
import { jobs } from "@/data/jobs"

const careerSchema = z.object({
  jobId: z.string().optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  coverNote: z.string().optional(),
})

type FormValues = z.infer<typeof careerSchema>

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-destructive" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

interface CareersApplyFormProps {
  preselectedJobId?: string
}

export const CareersApplyForm = forwardRef<HTMLElement, CareersApplyFormProps>(
  function CareersApplyForm({ preselectedJobId }, ref) {
    const [submitted, setSubmitted] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValues>({
      resolver: zodResolver(careerSchema),
      defaultValues: {
        jobId: preselectedJobId ?? "",
        fullName: "",
        email: "",
        phone: "",
        coverNote: "",
      },
    })

    const onSubmit = (data: FormValues) => {
      setServerError(null)
      startTransition(async () => {
        const result = await submitApplication(data)
        if (result.success) {
          setSubmitted(true)
        } else {
          setServerError(result.error)
        }
      })
    }

    if (submitted) {
      return (
        <section ref={ref} id="apply" aria-labelledby="apply-success-heading">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex justify-center mb-5">
                <span className="flex items-center justify-center size-16 rounded-full bg-green-100">
                  <CheckCircle className="size-8 text-green-600" aria-hidden="true" />
                </span>
              </div>
              <h2
                id="apply-success-heading"
                className="text-xl font-bold text-gray-900 mb-2"
              >
                Application Received!
              </h2>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Thank you for your interest in joining Care In Our Hand. We&apos;ll review your
                application and be in touch within 5 business days.
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
                Submit Another Application
              </Button>
            </CardContent>
          </Card>
        </section>
      )
    }

    return (
      <section ref={ref} id="apply" aria-labelledby="apply-form-heading">
        <Card>
          <CardHeader className="border-b">
            <CardTitle id="apply-form-heading" className="text-xl font-semibold text-gray-900">
              Apply Now
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Interested in joining our team? Fill out the form below and we&apos;ll be in touch.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Job application form">
              <div className="space-y-4">
                {/* Position */}
                <div className="space-y-1.5">
                  <Label htmlFor="jobId">Which Position</Label>
                  <Select id="jobId" {...register("jobId")}>
                    <option value="">General Application</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">
                    Full Name{" "}
                    <span className="text-destructive" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    {...register("fullName")}
                    aria-invalid={!!errors.fullName}
                  />
                  <FieldError message={errors.fullName?.message} />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">
                      Email{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
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
                    <Label htmlFor="phone">
                      Phone{" "}
                      <span className="text-destructive" aria-hidden="true">
                        *
                      </span>
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
                </div>

                {/* Cover note */}
                <div className="space-y-1.5">
                  <Label htmlFor="coverNote">
                    Cover Note{" "}
                    <span className="text-xs text-gray-500 font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="coverNote"
                    placeholder="Tell us briefly why you'd be a great fit…"
                    className="min-h-[120px]"
                    {...register("coverNote")}
                  />
                </div>

                {/* Resume note */}
                <div className="flex items-start gap-2.5 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Info
                    className="size-4 text-blue-600 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Please email your resume to{" "}
                    <a
                      href="mailto:careers@careinourhand.com.au"
                      className="font-medium underline hover:no-underline"
                    >
                      careers@careinourhand.com.au
                    </a>{" "}
                    with the position title as the subject line.
                  </p>
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
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    )
  }
)
