"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { createService } from "@/actions/admin/create-service"

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters and hyphens only"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
  image: z.string().optional(),
  brochureUrl: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CreateServiceForm() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true,
      image: "",
      brochureUrl: "",
    },
  })

  const titleValue = watch("title")
  const imageValue = watch("image")
  const brochureUrlValue = watch("brochureUrl")

  useEffect(() => {
    setValue("slug", toSlug(titleValue ?? ""), { shouldValidate: false })
  }, [titleValue, setValue])

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await createService(data)
      if (result?.error) {
        setError("root", { message: result.error })
      }
    })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#620E87] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Services
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass-card p-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary">Summary *</Label>
            <Textarea
              id="summary"
              {...register("summary")}
              rows={3}
              placeholder="Short description shown on service cards"
            />
            {errors.summary && <p className="text-xs text-red-500">{errors.summary.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={10}
              placeholder="Full description for the service detail page"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="icon">Icon Name</Label>
            <Input id="icon" {...register("icon")} placeholder="e.g. Briefcase, Heart, Users" />
            <p className="text-xs text-gray-400">Use Lucide icon names (see lucide.dev)</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="order">Display Order</Label>
            <Input id="order" type="number" min={0} {...register("order", { valueAsNumber: true })} className="w-32" />
            {errors.order && <p className="text-xs text-red-500">{errors.order.message}</p>}
          </div>

          <div className="space-y-1.5">
            <FileUpload
              label="Service Photo"
              accept="image/*"
              maxSize={5}
              currentUrl={imageValue || null}
              onUpload={(url) => setValue("image", url, { shouldValidate: true })}
              onRemove={() => setValue("image", "", { shouldValidate: false })}
            />
            <p className="text-xs text-gray-400">
              Upload a photo that represents this service
            </p>
          </div>

          <div className="space-y-1.5">
            <FileUpload
              label="Service Brochure (PDF)"
              accept="application/pdf"
              maxSize={10}
              currentUrl={brochureUrlValue || null}
              onUpload={(url) => setValue("brochureUrl", url, { shouldValidate: true })}
              onRemove={() => setValue("brochureUrl", "", { shouldValidate: false })}
            />
            <p className="text-xs text-gray-400">
              Upload a downloadable PDF brochure for this service
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="w-4 h-4 accent-[#620E87]"
            />
            <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
          </div>

          {errors.root && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errors.root.message}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#89C541] hover:bg-[#6da033] text-white"
            >
              {isPending ? "Creating..." : "Create Service"}
            </Button>
            <Link href="/admin/services">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
