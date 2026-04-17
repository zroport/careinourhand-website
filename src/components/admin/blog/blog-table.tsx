"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { FileText, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableRow, DataTableCell } from "@/components/admin/data-table"
import { EmptyState } from "@/components/admin/empty-state"
import { deleteBlogPost } from "@/actions/admin/delete-blog"

type BlogPost = {
  id: string
  title: string
  slug: string
  author: string
  isPublished: boolean
  publishedAt: Date | null
  createdAt: Date
}

type Filter = "ALL" | "PUBLISHED" | "DRAFT"

interface BlogTableProps {
  posts: BlogPost[]
}

export function BlogTable({ posts }: BlogTableProps) {
  const [filter, setFilter] = useState<Filter>("ALL")
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered =
    filter === "ALL"
      ? posts
      : filter === "PUBLISHED"
      ? posts.filter((p) => p.isPublished)
      : posts.filter((p) => !p.isPublished)

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    startTransition(async () => {
      await deleteBlogPost(id)
      setDeletingId(null)
    })
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {(["ALL", "PUBLISHED", "DRAFT"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f
                ? "bg-[#620E87] text-white"
                : "bg-white/60 text-gray-600 hover:bg-purple-50"
            }`}
          >
            {f === "ALL" ? "All" : f === "PUBLISHED" ? "Published" : "Draft"}
            <span className="ml-1.5 opacity-70">
              {f === "ALL"
                ? posts.length
                : f === "PUBLISHED"
                ? posts.filter((p) => p.isPublished).length
                : posts.filter((p) => !p.isPublished).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts found"
          description={filter === "ALL" ? "Create your first blog post." : `No ${filter.toLowerCase()} posts.`}
        />
      ) : (
        <DataTable headers={["Title", "Slug", "Author", "Status", "Published", ""]}>
          {filtered.map((post) => (
            <DataTableRow key={post.id}>
              <DataTableCell>
                <span className="font-medium text-gray-900 line-clamp-1 max-w-xs">{post.title}</span>
              </DataTableCell>
              <DataTableCell>
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                  {post.slug}
                </code>
              </DataTableCell>
              <DataTableCell>
                <span className="text-sm">{post.author}</span>
              </DataTableCell>
              <DataTableCell>
                {post.isPublished ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                    Draft
                  </span>
                )}
              </DataTableCell>
              <DataTableCell>
                <span className="text-xs text-gray-400">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </DataTableCell>
              <DataTableCell>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/blog/${post.id}/edit`}>
                    <Button size="sm" variant="ghost" className="text-[#620E87] hover:bg-purple-50 gap-1">
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 gap-1"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={isPending && deletingId === post.id}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTable>
      )}
    </>
  )
}
