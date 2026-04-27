"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  MessageSquare,
  MessageCircle,
  Briefcase,
  FileText,
  LayoutGrid,
  HelpCircle,
  Settings,
  Menu,
  X,
  ClipboardList,
  Image,
  Layout,
  Users,
  PanelLeft,
  Star,
  FolderImage,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SignOutButton } from "@/components/admin/sign-out-button"
import { canAccess, type Module } from "@/lib/permissions"
import type { UserRole } from "@prisma/client"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  module: Module
}

interface NavSection {
  heading: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    heading: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, module: "dashboard" },
    ],
  },
  {
    heading: "INBOX",
    items: [
      { label: "Referrals", href: "/admin/referrals", icon: Inbox, module: "referrals" },
      { label: "Bookings", href: "/admin/bookings", icon: Calendar, module: "bookings" },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare, module: "messages" },
      { label: "Feedback", href: "/admin/feedback", icon: MessageCircle, module: "feedback" },
      { label: "Applications", href: "/admin/applications", icon: Briefcase, module: "applications" },
    ],
  },
  {
    heading: "CONTENT",
    items: [
      { label: "Blog Posts", href: "/admin/blog", icon: FileText, module: "blog" },
      { label: "Services", href: "/admin/services", icon: LayoutGrid, module: "services" },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, module: "faqs" },
      { label: "Job Listings", href: "/admin/jobs", icon: ClipboardList, module: "jobs" },
      { label: "Home Slider", href: "/admin/slides", icon: Image, module: "slides" },
      { label: "Page Headers", href: "/admin/page-headers", icon: Layout, module: "page-headers" },
      { label: "Page Manager", href: "/admin/pages", icon: PanelLeft, module: "page-manager" },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star, module: "testimonials" },
      { label: "Media Library", href: "/admin/media", icon: FolderImage, module: "media" },
    ],
  },
  {
    heading: "SETTINGS",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings, module: "settings" },
      { label: "User Management", href: "/admin/users", icon: Users, module: "users" },
    ],
  },
]

interface SidebarProps {
  userName?: string | null
  userEmail?: string | null
  userRole?: UserRole | null
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const isActive =
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
        isActive
          ? "border-l-[3px] border-[#89C541] bg-purple-50 text-[#620E87] pl-[calc(0.75rem-3px)]"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-[3px] border-transparent pl-[calc(0.75rem-3px)]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      {item.label}
    </Link>
  )
}

interface SidebarContentProps {
  userName?: string | null
  userEmail?: string | null
  userRole?: UserRole | null
}

function SidebarContent({ userName, userEmail, userRole }: SidebarContentProps) {
  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !userRole || canAccess(userRole, item.module)
      ),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/40">
        <p className="text-lg font-bold" style={{ color: "#620E87" }}>
          Care In Our Hand
        </p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Admin navigation">
        {filteredSections.map((section) => (
          <div key={section.heading}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              {section.heading}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-3 py-4 border-t border-white/40">
        <div className="glass-card px-3 py-3 mb-2">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ background: "#620E87" }}
              aria-hidden="true"
            >
              {userName?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName ?? "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userEmail ?? ""}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}

export function AdminSidebar({ userName, userEmail, userRole }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-2 shadow-md"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-5 h-5 text-gray-700" aria-hidden="true" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 admin-sidebar-bg glass-card rounded-none border-r transition-transform duration-300 lg:hidden shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Admin sidebar"
      >
        <button
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5 text-gray-600" aria-hidden="true" />
        </button>
        <SidebarContent userName={userName} userEmail={userEmail} userRole={userRole} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 shrink-0 admin-sidebar-bg glass-card rounded-none border-r h-screen sticky top-0"
        aria-label="Admin sidebar"
      >
        <SidebarContent userName={userName} userEmail={userEmail} userRole={userRole} />
      </aside>
    </>
  )
}
