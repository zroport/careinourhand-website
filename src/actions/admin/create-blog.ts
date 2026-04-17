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

export async function createBlogPost(formData: unknown) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const parsed = schema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } })
  if (existing) {
    return { error: "A post with this slug already exists" }
  }

  await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      author: data.author,
      isPublished: data.isPublished,
      publishedAt: data.isPublished ? new Date() : null,
    },
  })

  revalidatePath("/admin/blog")
  revalidatePath("/blog")
  redirect("/admin/blog")
}
