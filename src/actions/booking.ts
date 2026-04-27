"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendEmail, adminEmail } from "@/lib/email"
import { newBookingAdmin, bookingReceived } from "@/lib/email-templates"

const bookingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  serviceType: z.string().min(1, "Please select a service"),
  preferredDate: z
    .string()
    .min(1, "Please select a date")
    .refine((dateStr) => {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, "Date must be today or in the future"),
  preferredTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "You must agree to the Terms of Service"),
})

export type BookingFormData = z.infer<typeof bookingSchema>

export type BookingActionResult =
  | { success: true; id: string; email: string }
  | { success: false; error: string }

export async function submitBooking(data: BookingFormData): Promise<BookingActionResult> {
  try {
    const parsed = bookingSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }

    const v = parsed.data
    const booking = await prisma.booking.create({
      data: {
        fullName: v.fullName,
        email: v.email,
        phone: v.phone,
        address: v.address,
        serviceType: v.serviceType,
        preferredDate: new Date(v.preferredDate),
        preferredTime: v.preferredTime,
        notes: v.notes || null,
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
    const dateStr = new Date(v.preferredDate).toLocaleDateString("en-AU", { dateStyle: "long" })

    await Promise.all([
      sendEmail({
        to: adminEmail(),
        ...newBookingAdmin({
          id: booking.id,
          fullName: v.fullName,
          email: v.email,
          phone: v.phone,
          address: v.address,
          serviceType: v.serviceType,
          preferredDate: dateStr,
          preferredTime: v.preferredTime,
          notes: v.notes,
          adminUrl: `${baseUrl}/admin/bookings`,
        }),
      }),
      sendEmail({
        to: v.email,
        ...bookingReceived({
          fullName: v.fullName,
          serviceType: v.serviceType,
          preferredDate: dateStr,
          preferredTime: v.preferredTime,
        }),
      }),
    ])

    return { success: true, id: booking.id, email: v.email }
  } catch (err) {
    console.error("submitBooking error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
