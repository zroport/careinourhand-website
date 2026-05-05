import { BlogCard, type BlogCardPost } from "./blog-card"
import { Newspaper } from "lucide-react"

interface BlogGridProps {
  posts: BlogCardPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <section className="py-12 sm:py-16 bg-gray-50" aria-labelledby="blog-grid-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="blog-grid-heading" className="sr-only">
          All blog posts
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-purple-100 mb-6" aria-hidden="true">
              <Newspaper className="size-8 text-[#620E87]" />
            </div>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              No posts yet. Check back soon for NDIS updates, care tips, and community news from Care In Our Hand.
            </p>
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-hide sm:grid sm:grid-cols-2 sm:overflow-visible sm:snap-none sm:pb-0 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <div key={post.id} className="snap-start shrink-0 min-w-[280px] sm:min-w-0">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
