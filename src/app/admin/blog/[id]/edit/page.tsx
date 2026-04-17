import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BlogForm } from "@/components/admin/blog/blog-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Edit Post | Admin",
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
      <BlogForm
        mode="edit"
        postId={post.id}
        isPublished={post.isPublished}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          author: post.author,
          isPublished: post.isPublished,
        }}
      />
    </div>
  )
}
