import Link from "next/link"
import { requireRole } from "@/lib/require-role"
import { PAGE_SCHEMAS } from "@/lib/page-content"

export default async function AdminPagesLayout({ children }: { children: React.ReactNode }) {
  await requireRole("page-manager")

  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      {/* Sub-nav */}
      <aside className="w-48 shrink-0">
        <div className="glass-card p-3 sticky top-0">
          <p className="px-2 mb-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
            Pages
          </p>
          <nav className="space-y-0.5">
            {PAGE_SCHEMAS.map((page) => (
              <Link
                key={page.slug}
                href={`/admin/pages/${page.slug}`}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
