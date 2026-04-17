import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { BookingsTable } from "@/components/admin/bookings/bookings-table"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Bookings | Admin",
}

export default async function BookingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          {bookings.length}
        </span>
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  )
}
