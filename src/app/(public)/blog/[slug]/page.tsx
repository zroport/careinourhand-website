// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ChevronRight, Home, User, Calendar, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BlogCard, type BlogCardPost } from "@/components/blog/blog-card"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    })
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true },
  })

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: `${post.title} | Care In Our Hand`,
    description: post.excerpt ?? undefined,
  }
}

function formatDate(date: Date | null): string {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
  })

  if (!post) {
    notFound()
  }

  // Fetch 2 related posts (other published posts, most recent)
  const relatedPosts: BlogCardPost[] = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      slug: { not: slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 2,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      author: true,
      publishedAt: true,
    },
  })

  const paragraphs = post.content.split("\n\n").filter(Boolean)

  return (
    <>
      {/* Cover banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden" aria-hidden="true">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(135deg, #8b1ab8 0%, #a02ed4 50%, #89C541 100%)",
            }}
          >
            <div
              className="w-full h-full opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        )}
      </div>

      {/* Article */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-gray-400 text-sm mb-8 flex-wrap"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#620E87] transition-colors"
              aria-label="Go to Home page"
            >
              <Home className="size-3.5" aria-hidden="true" />
              Home
            </Link>
            <ChevronRight className="size-3.5 text-gray-300" aria-hidden="true" />
            <Link
              href="/blog"
              className="hover:text-[#620E87] transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="size-3.5 text-gray-300" aria-hidden="true" />
            <span className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {post.title}
            </span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-5">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <User className="size-4 text-[#620E87]" aria-hidden="true" />
              {post.author}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 text-[#620E87]" aria-hidden="true" />
                <time dateTime={new Date(post.publishedAt).toISOString().split("T")[0]}>
                  {formatDate(post.publishedAt)}
                </time>
              </span>
            )}
          </div>

          {/* Content */}
          <div className="prose-like">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-gray-700 leading-relaxed text-[1.0625rem] mb-5 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Share */}
          <Separator className="my-10" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <p className="text-sm font-semibold text-gray-700">Share this article</p>
            <div className="flex items-center gap-3" role="list" aria-label="Share on social media">
              <span role="listitem">
                <button
                  type="button"
                  aria-label="Share on Facebook"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 text-xs font-medium transition-colors"
                >
                  <Share2 className="size-3.5" aria-hidden="true" />
                  Facebook
                </button>
              </span>
              <span role="listitem">
                <button
                  type="button"
                  aria-label="Share on LinkedIn"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-800 text-xs font-medium transition-colors"
                >
                  <Share2 className="size-3.5" aria-hidden="true" />
                  LinkedIn
                </button>
              </span>
              <span role="listitem">
                <button
                  type="button"
                  aria-label="Share on Twitter / X"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-600 text-xs font-medium transition-colors"
                >
                  <Share2 className="size-3.5" aria-hidden="true" />
                  Twitter
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="related-posts-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              id="related-posts-heading"
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8"
            >
              Related Posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-white" aria-labelledby="post-cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="rounded-2xl px-6 py-10 sm:py-12"
            style={{
              background: "linear-gradient(135deg, #620E87 0%, #8b1ab8 100%)",
            }}
          >
            <h2
              id="post-cta-heading"
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
            >
              Need NDIS Support?
            </h2>
            <p className="text-purple-200 mb-8 max-w-md mx-auto">
              We&apos;re here to help. Get in touch with our team or explore our full range of services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#620E87] hover:bg-purple-50 font-semibold border-0"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                size="lg"
                className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
                asChild
              >
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
