import { UserRole } from "@prisma/client"

export type Module =
  | "dashboard"
  | "referrals"
  | "bookings"
  | "messages"
  | "feedback"
  | "applications"
  | "blog"
  | "services"
  | "faqs"
  | "jobs"
  | "slides"
  | "page-headers"
  | "page-manager"
  | "testimonials"
  | "media"
  | "logos"
  | "service-areas"
  | "settings"
  | "users"

const PERMISSIONS: Record<Module, UserRole[]> = {
  dashboard:    [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING, UserRole.STAFF, UserRole.ACCOUNTS],
  referrals:    [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
  bookings:     [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF, UserRole.ACCOUNTS],
  messages:     [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
  feedback:     [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF],
  applications: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  blog:         [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  services:     [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  faqs:         [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  jobs:         [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  slides:       [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  "page-headers": [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  "page-manager": [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  testimonials: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  media:        [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  logos:          [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  "service-areas":[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MARKETING],
  settings:       [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  users:        [UserRole.SUPER_ADMIN, UserRole.ADMIN],
}

export function canAccess(role: UserRole, module: Module): boolean {
  return PERMISSIONS[module].includes(role)
}

export function getAllowedModules(role: UserRole): Module[] {
  return (Object.keys(PERMISSIONS) as Module[]).filter((m) =>
    PERMISSIONS[m].includes(role)
  )
}
