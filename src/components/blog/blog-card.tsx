import Link from "next/link"
import { ArrowRight, User, Calendar } from "lucide-react"

export interface BlogCardPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  author: string
  publishedAt: Date | null
}

function formatDate(date: Date | null): string {
  if (!date) return ""
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
      {/* Cover image / placeholder */}
      <div className="relative h-44 sm:h-48 overflow-hidden" aria-hidden="true">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-[#620E87] transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="focus-visible:outline-none focus-visible:underline">
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <User className="size-3.5 text-[#620E87]" aria-hidden="true" />
            {post.author}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-[#620E87]" aria-hidden="true" />
              <time dateTime={new Date(post.publishedAt).toISOString().split("T")[0]}>
                {formatDate(post.publishedAt)}
              </time>
            </span>
          )}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[#620E87] hover:text-[#4a0b66] transition-colors group/link"
          aria-label={`Read more about ${post.title}`}
        >
          Read More
          <ArrowRight
            className="size-4 group-hover/link:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
