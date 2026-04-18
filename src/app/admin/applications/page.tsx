import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApplicationsTable } from "@/components/admin/applications/applications-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Job Applications | Admin",
}

export default async function ApplicationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const [applications, jobListings] = await Promise.all([
    prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        jobId: true,
        coverNote: true,
        resume: true,
        createdAt: true,
      },
    }),
    prisma.jobListing.findMany({
      select: { id: true, title: true },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          {applications.length}
        </span>
      </div>
      <ApplicationsTable applications={applications} jobListings={jobListings} />
    </div>
  )
}
