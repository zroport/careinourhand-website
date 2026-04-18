import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { JobsTable } from "@/components/admin/jobs/jobs-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Job Listings | Admin",
}

export default async function AdminJobsPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const jobs = await prisma.jobListing.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto">
      <JobsTable jobs={jobs} />
    </div>
  )
}
