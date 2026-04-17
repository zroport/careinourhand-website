"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Excerpt must be 200 characters or less"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  isPublished: z.boolean(),
})

export async function updateBlogPost(id: string, formData: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = schema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } })
  if (existing && existing.id !== id) {
    return { error: "A post with this slug already exists" }
  }

  const current = await prisma.blogPost.findUnique({ where: { id } })
  if (!current) return { error: "Post not found" }

  const wasPublished = current.isPublished
  const publishedAt =
    data.isPublished && !wasPublished
      ? new Date()
      : data.isPublished
      ? current.publishedAt
      : null

  await prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      author: data.author,
      isPublished: data.isPublished,
      publishedAt,
    },
  })

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  if (current.slug) revalidatePath(`/blog/${current.slug}`)
  if (data.slug !== current.slug) revalidatePath(`/blog/${data.slug}`)
  redirect("/admin/blog")
}

export async function toggleBlogPublished(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) throw new Error("Post not found")

  const isPublished = !post.isPublished

  await prisma.blogPost.update({
    where: { id },
    data: {
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  })

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  revalidatePath(`/blog/${post.slug}`)
}
