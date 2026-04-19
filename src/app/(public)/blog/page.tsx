// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BlogHero } from "@/components/blog/blog-hero"
import { BlogGrid } from "@/components/blog/blog-grid"
import { getPageHeader } from "@/lib/page-header"

export const metadata: Metadata = {
  title: "Blog | Care In Our Hand",
  description:
    "Stay up to date with NDIS updates, community events, care tips, and news from Care In Our Hand.",
}

export default async function BlogPage() {
  const [posts, pageHeader] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        author: true,
        publishedAt: true,
      },
    }),
    getPageHeader("blog"),
  ])

  return (
    <>
      <BlogHero pageHeader={pageHeader} />
      <BlogGrid posts={posts} />
    </>
  )
}
