"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBlogPost } from "@/actions/admin/create-blog"
import { updateBlogPost, toggleBlogPublished } from "@/actions/admin/update-blog"
import { deleteBlogPost } from "@/actions/admin/delete-blog"
import { ImageUpload } from "@/components/admin/ImageUpload"

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
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Max 200 characters"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  isPublished: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface BlogFormProps {
  mode: "create" | "edit"
  postId?: string
  defaultValues?: Partial<FormValues>
  isPublished?: boolean
}

export function BlogForm({ mode, postId, defaultValues, isPublished }: BlogFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [isToggling, startToggleTransition] = useTransition()

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
      author: "Care In Our Hand",
      isPublished: false,
      ...defaultValues,
    },
  })

  const titleValue = watch("title")
  const excerptValue = watch("excerpt") ?? ""
  const coverImageValue = watch("coverImage") ?? ""
  const slugTouched = !!defaultValues?.slug

  useEffect(() => {
    if (!slugTouched && titleValue) {
      setValue("slug", toSlug(titleValue), { shouldValidate: false })
    }
  }, [titleValue, slugTouched, setValue])

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createBlogPost(data)
          : await updateBlogPost(postId!, data)

      if (result?.error) {
        setError("root", { message: result.error })
      }
    })
  }

  function handleTogglePublish() {
    if (!postId) return
    startToggleTransition(async () => {
      await toggleBlogPublished(postId)
    })
  }

  function handleDelete() {
    if (!postId) return
    if (!window.confirm("Delete this post permanently? This cannot be undone.")) return
    startDeleteTransition(async () => {
      await deleteBlogPost(postId)
    })
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#620E87] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Posts
      </Link>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="glass-card p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} placeholder="My Blog Post" />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} placeholder="my-blog-post" />
            {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <span className={`text-xs ${excerptValue.length > 200 ? "text-red-500" : "text-gray-400"}`}>
                {excerptValue.length}/200
              </span>
            </div>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="A brief summary of the post..."
              rows={3}
            />
            {errors.excerpt && <p className="text-xs text-red-500">{errors.excerpt.message}</p>}
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Write your post content here. Separate paragraphs with blank lines."
              rows={12}
            />
            {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
          </div>

          {/* Cover Image */}
          <ImageUpload
            label="Cover Image"
            value={coverImageValue}
            onChange={(url) => setValue("coverImage", url)}
          />

          {/* Author */}
          <div className="space-y-1.5">
            <Label htmlFor="author">Author *</Label>
            <Input id="author" {...register("author")} />
            {errors.author && <p className="text-xs text-red-500">{errors.author.message}</p>}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isPublished"
              {...register("isPublished")}
              className="w-4 h-4 accent-[#620E87]"
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Publish immediately
            </Label>
          </div>

          {/* Error */}
          {errors.root && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {errors.root.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#89C541] hover:bg-[#6da033] text-white gap-2"
            >
              {isPending ? "Saving..." : mode === "create" ? "Save Post" : "Save Changes"}
            </Button>
            <Link href="/admin/blog">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            {mode === "edit" && postId && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTogglePublish}
                  disabled={isToggling}
                  className="ml-auto"
                >
                  {isToggling ? "Updating..." : isPublished ? "Unpublish" : "Publish"}
                </Button>
              </>
            )}
          </div>
        </div>
      </form>

      {mode === "edit" && postId && (
        <div className="glass-card p-4 border border-red-100">
          <p className="text-sm font-semibold text-red-600 mb-3">Danger Zone</p>
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-50 gap-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete Post"}
          </Button>
        </div>
      )}
    </div>
  )
}
