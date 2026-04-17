import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Inbox, Calendar, MessageSquare, Briefcase } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { RecentReferrals } from "@/components/admin/recent-referrals"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { QuickActions } from "@/components/admin/quick-actions"

export const metadata = {
  title: "Dashboard | Admin",
}

async function getDashboardData() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    newReferralsCount,
    pendingBookingsCount,
    unreadMessagesCount,
    newApplicationsCount,
    recentReferrals,
    recentBookings,
  ] = await Promise.all([
    prisma.referral.count({ where: { status: "NEW" } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.jobApplication.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.referral.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        participantName: true,
        coordinatorName: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        serviceType: true,
        preferredDate: true,
        status: true,
        createdAt: true,
      },
    }),
  ])

  return {
    newReferralsCount,
    pendingBookingsCount,
    unreadMessagesCount,
    newApplicationsCount,
    recentReferrals,
    recentBookings,
  }
}

export default async function AdminDashboardPage() {
  const session = await auth()
  const data = await getDashboardData()

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.name ?? "Admin"}!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here&apos;s what&apos;s happening at Care In Our Hand today.
          </p>
        </div>
        <p className="text-sm text-gray-400 shrink-0">{today}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="New Referrals"
          count={data.newReferralsCount}
          icon={Inbox}
          iconBg="bg-purple-100"
          iconColor="text-purple-700"
          href="/admin/referrals"
        />
        <StatsCard
          label="Pending Bookings"
          count={data.pendingBookingsCount}
          icon={Calendar}
          iconBg="bg-green-100"
          iconColor="text-green-700"
          href="/admin/bookings"
        />
        <StatsCard
          label="Unread Messages"
          count={data.unreadMessagesCount}
          icon={MessageSquare}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          href="/admin/messages"
        />
        <StatsCard
          label="New Applications"
          count={data.newApplicationsCount}
          icon={Briefcase}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          href="/admin/applications"
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentReferrals referrals={data.recentReferrals} />
        <RecentBookings bookings={data.recentBookings} />
      </div>

      {/* Quick actions */}
      <QuickActions />
    </div>
  )
}
