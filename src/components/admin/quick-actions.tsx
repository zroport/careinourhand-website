import Link from "next/link"
import { FileText, Plus, HelpCircle, Settings } from "lucide-react"

const actions = [
  {
    label: "Write a Blog Post",
    href: "/admin/blog/new",
    icon: FileText,
    description: "Create and publish a new article",
  },
  {
    label: "Add a Service",
    href: "/admin/services/new",
    icon: Plus,
    description: "Add a new NDIS support service",
  },
  {
    label: "Update FAQ",
    href: "/admin/faqs",
    icon: HelpCircle,
    description: "Edit frequently asked questions",
  },
  {
    label: "Change Site Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Update global site configuration",
  },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="glass-card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group"
              aria-label={action.label}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(98,14,135,0.08)" }}
                aria-hidden="true"
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: "#620E87" }}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-[#620E87] transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
