import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlogTable } from "@/components/admin/blog/blog-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Blog Posts | Admin",
}

export default async function BlogPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
            {posts.length}
          </span>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-[#89C541] hover:bg-[#6da033] text-white gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>
      <BlogTable posts={posts} />
    </div>
  )
}
