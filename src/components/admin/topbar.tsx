"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ExternalLink } from "lucide-react"

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/referrals": "Referrals",
  "/admin/bookings": "Bookings",
  "/admin/messages": "Messages",
  "/admin/feedback": "Feedback",
  "/admin/applications": "Applications",
  "/admin/blog": "Blog Posts",
  "/admin/blog/new": "New Blog Post",
  "/admin/services": "Services",
  "/admin/services/new": "New Service",
  "/admin/faqs": "FAQs",
  "/admin/settings": "Site Settings",
}

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  // Handle dynamic segments
  const segments = pathname.split("/")
  if (segments.length >= 3) {
    const base = segments.slice(0, 3).join("/")
    if (pageTitles[base]) return pageTitles[base]
  }
  return "Admin"
}

interface TopBarProps {
  userName?: string | null
}

export function AdminTopBar({ userName }: TopBarProps) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="glass-card rounded-none border-b sticky top-0 z-30 px-6 py-3 flex items-center justify-between gap-4">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-800 ml-10 lg:ml-0">
        {pageTitle}
      </h1>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* View site */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="View public website in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          View Site
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Notifications (3 new)"
        >
          <Bell className="w-5 h-5 text-gray-600" aria-hidden="true" />
          <span
            className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: "#620E87" }}
            aria-hidden="true"
          >
            3
          </span>
        </button>

        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ background: "#620E87" }}
          aria-label={`Logged in as ${userName ?? "Admin"}`}
          role="img"
        >
          {userName?.[0]?.toUpperCase() ?? "A"}
        </div>
      </div>
    </header>
  )
}
