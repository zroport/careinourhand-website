"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
type ReferralStatus = "NEW" | "IN_REVIEW" | "CONTACTED" | "ACCEPTED" | "DECLINED"

export async function updateReferralStatus(referralId: string, status: ReferralStatus) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  await prisma.referral.update({
    where: { id: referralId },
    data: { status },
  })

  revalidatePath("/admin/referrals")
  revalidatePath("/admin")
}
