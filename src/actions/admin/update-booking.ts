"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"
import { bookingConfirmed } from "@/lib/email-templates"

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  })

  if (status === "CONFIRMED") {
    await sendEmail({
      to: booking.email,
      ...bookingConfirmed({
        fullName: booking.fullName,
        serviceType: booking.serviceType,
        preferredDate: booking.preferredDate.toLocaleDateString("en-AU", { dateStyle: "long" }),
        preferredTime: booking.preferredTime,
      }),
    })
  }

  revalidatePath("/admin/bookings")
  revalidatePath("/admin")
}
