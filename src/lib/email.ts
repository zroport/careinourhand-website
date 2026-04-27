import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? "Care In Our Hand <noreply@careinourhand.com.au>"
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? "admin@careinourhand.com.au"

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email:", payload.subject)
    return
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
    })
  } catch (err) {
    // Email failure must never break the primary action
    console.error("[email] send failed:", err)
  }
}

export function adminEmail(): string {
  return ADMIN_EMAIL
}
