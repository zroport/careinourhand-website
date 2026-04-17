"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { BookingStatus } from "@prisma/client"

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  })

  revalidatePath("/admin/bookings")
  revalidatePath("/admin")
}
