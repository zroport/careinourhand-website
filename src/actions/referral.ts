"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
type ManagementType = "SELF_MANAGED" | "PLAN_MANAGED" | "NDIA_MANAGED"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const referralSchema = z
  .object({
    role: z.string(),
    coordinatorName: z.string().optional(),
    coordinatorOrg: z.string().optional(),
    coordinatorPhone: z.string().optional(),
    coordinatorEmail: z.string().optional(),
    participantName: z.string().optional(),
    participantPhone: z.string().optional(),
    participantEmail: z.string().optional(),
    yourName: z.string().optional(),
    yourPhone: z.string().optional(),
    yourEmail: z.string().optional(),
    ndisNumber: z.string().optional(),
    managementType: z.string().optional(),
    servicesNeeded: z.array(z.string()),
    additionalNotes: z.string().optional(),
    consent: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.role !== "coordinator" && data.role !== "participant") {
      ctx.addIssue({ code: "custom", path: ["role"], message: "Please select your role" })
      return
    }

    if (data.role === "coordinator") {
      if (!data.coordinatorName?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorName"], message: "Coordinator name is required" })
      if (!data.coordinatorOrg?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorOrg"], message: "Organisation name is required" })
      if (!data.coordinatorPhone?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorPhone"], message: "Phone number is required" })
      if (!data.coordinatorEmail?.trim())
        ctx.addIssue({ code: "custom", path: ["coordinatorEmail"], message: "Email address is required" })
      else if (!emailRegex.test(data.coordinatorEmail))
        ctx.addIssue({ code: "custom", path: ["coordinatorEmail"], message: "Invalid email address" })
      if (!data.participantName?.trim())
        ctx.addIssue({ code: "custom", path: ["participantName"], message: "Participant name is required" })
    } else {
      if (!data.yourName?.trim())
        ctx.addIssue({ code: "custom", path: ["yourName"], message: "Your name is required" })
      if (!data.yourPhone?.trim())
        ctx.addIssue({ code: "custom", path: ["yourPhone"], message: "Phone number is required" })
      if (!data.yourEmail?.trim())
        ctx.addIssue({ code: "custom", path: ["yourEmail"], message: "Email address is required" })
      else if (!emailRegex.test(data.yourEmail))
        ctx.addIssue({ code: "custom", path: ["yourEmail"], message: "Invalid email address" })
    }

    if (data.servicesNeeded.length === 0)
      ctx.addIssue({ code: "custom", path: ["servicesNeeded"], message: "Please select at least one service" })

    if (!data.consent)
      ctx.addIssue({ code: "custom", path: ["consent"], message: "You must agree to the consent statement" })
  })

export type ReferralFormData = z.infer<typeof referralSchema>

export type ReferralActionResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function submitReferral(data: ReferralFormData): Promise<ReferralActionResult> {
  try {
    const parsed = referralSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Validation failed. Please check your inputs." }
    }

    const v = parsed.data
    const mgmt =
      v.managementType && v.managementType !== ""
        ? (v.managementType as ManagementType)
        : null

    const referral = await prisma.referral.create({
      data:
        v.role === "coordinator"
          ? {
              participantName: v.participantName!,
              participantPhone: v.participantPhone || null,
              participantEmail: v.participantEmail || null,
              ndisNumber: v.ndisNumber || null,
              managementType: mgmt,
              coordinatorName: v.coordinatorName!,
              coordinatorOrg: v.coordinatorOrg!,
              coordinatorPhone: v.coordinatorPhone!,
              coordinatorEmail: v.coordinatorEmail!,
              servicesNeeded: v.servicesNeeded.join(", "),
              additionalNotes: v.additionalNotes || null,
            }
          : {
              participantName: v.yourName!,
              participantPhone: v.yourPhone!,
              participantEmail: v.yourEmail!,
              ndisNumber: v.ndisNumber || null,
              managementType: mgmt,
              coordinatorName: null,
              coordinatorOrg: null,
              coordinatorPhone: null,
              coordinatorEmail: null,
              servicesNeeded: v.servicesNeeded.join(", "),
              additionalNotes: v.additionalNotes || null,
            },
    })

    return { success: true, id: referral.id }
  } catch (err) {
    console.error("submitReferral error:", err)
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
