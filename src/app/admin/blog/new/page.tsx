import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BlogForm } from "@/components/admin/blog/blog-form"

export const metadata = {
  title: "New Blog Post | Admin",
}

export default async function NewBlogPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
      <BlogForm mode="create" />
    </div>
  )
}
