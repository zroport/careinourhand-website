// Shared layout wrapper
function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="font-family:system-ui,sans-serif;background:#f5f3f8;margin:0;padding:24px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#620E87;padding:20px 28px;">
      <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">Care In Our Hand</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:12px;">NDIS Disability Support Provider</p>
    </div>
    <div style="padding:28px;">
      ${body}
    </div>
    <div style="background:#f9f7fc;padding:16px 28px;border-top:1px solid #eee;">
      <p style="margin:0;color:#888;font-size:11px;">Care In Our Hand · 15 Gribbin Road, Leppington NSW 2179 · <a href="mailto:info@careinourhand.com.au" style="color:#620E87;">info@careinourhand.com.au</a></p>
    </div>
  </div>
</body>
</html>`
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1a1a2e;">${text}</h1>`
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return ""
  return `<tr><td style="padding:6px 0;color:#666;font-size:13px;white-space:nowrap;vertical-align:top;width:160px;">${label}</td><td style="padding:6px 0;color:#1a1a2e;font-size:13px;">${value}</td></tr>`
}

function table(rows: string): string {
  return `<table style="border-collapse:collapse;width:100%;margin:12px 0;">${rows}</table>`
}

function badge(text: string, color = "#620E87"): string {
  return `<span style="display:inline-block;background:${color};color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;font-weight:600;">${text}</span>`
}

function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;background:#620E87;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">${label}</a>`
}

// ─── Admin notifications ──────────────────────────────────────────────────────

export function newBookingAdmin(b: {
  id: string
  fullName: string
  email: string
  phone: string
  address: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  notes?: string | null
  adminUrl: string
}): { subject: string; html: string } {
  return {
    subject: `New Booking Request — ${b.fullName}`,
    html: layout(
      "New Booking Request",
      `${heading("New Booking Request")}
      <p style="color:#555;font-size:14px;margin:0 0 16px;">A new booking has been submitted and is waiting for review.</p>
      ${table(
        row("Name", b.fullName) +
        row("Email", `<a href="mailto:${b.email}" style="color:#620E87;">${b.email}</a>`) +
        row("Phone", b.phone) +
        row("Address", b.address) +
        row("Service", b.serviceType) +
        row("Preferred Date", b.preferredDate) +
        row("Preferred Time", b.preferredTime) +
        row("Notes", b.notes || null)
      )}
      ${button("View in Admin", b.adminUrl)}`
    ),
  }
}

export function newReferralAdmin(r: {
  id: string
  participantName: string
  coordinatorName?: string | null
  coordinatorOrg?: string | null
  coordinatorEmail?: string | null
  servicesNeeded: string
  adminUrl: string
}): { subject: string; html: string } {
  return {
    subject: `New Referral — ${r.participantName}`,
    html: layout(
      "New Referral",
      `${heading("New Referral Received")}
      <p style="color:#555;font-size:14px;margin:0 0 16px;">A new referral has been submitted and is waiting for review.</p>
      ${table(
        row("Participant", r.participantName) +
        row("Coordinator", r.coordinatorName || null) +
        row("Organisation", r.coordinatorOrg || null) +
        row("Coordinator Email", r.coordinatorEmail ? `<a href="mailto:${r.coordinatorEmail}" style="color:#620E87;">${r.coordinatorEmail}</a>` : null) +
        row("Services Needed", r.servicesNeeded)
      )}
      ${button("View in Admin", r.adminUrl)}`
    ),
  }
}

export function newContactAdmin(c: {
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  adminUrl: string
}): { subject: string; html: string } {
  return {
    subject: `New Message from ${c.name}`,
    html: layout(
      "New Contact Message",
      `${heading("New Contact Message")}
      ${table(
        row("Name", c.name) +
        row("Email", `<a href="mailto:${c.email}" style="color:#620E87;">${c.email}</a>`) +
        row("Phone", c.phone || null) +
        row("Subject", c.subject || null)
      )}
      <div style="background:#f5f3f8;border-radius:8px;padding:14px;margin-top:12px;">
        <p style="margin:0;font-size:14px;color:#333;white-space:pre-wrap;">${c.message}</p>
      </div>
      ${button("View in Admin", c.adminUrl)}`
    ),
  }
}

export function newFeedbackAdmin(f: {
  type: string
  name?: string | null
  email?: string | null
  message: string
  isAnonymous: boolean
  adminUrl: string
}): { subject: string; html: string } {
  const typeColor = f.type === "COMPLAINT" ? "#dc2626" : f.type === "COMPLIMENT" ? "#16a34a" : "#d97706"
  return {
    subject: `New Feedback (${f.type})`,
    html: layout(
      "New Feedback",
      `${heading("New Feedback Received")}
      <p style="margin:0 0 12px;">${badge(f.type, typeColor)}</p>
      ${table(
        row("From", f.isAnonymous ? "Anonymous" : (f.name || "Not provided")) +
        row("Email", f.email ? `<a href="mailto:${f.email}" style="color:#620E87;">${f.email}</a>` : null)
      )}
      <div style="background:#f5f3f8;border-radius:8px;padding:14px;margin-top:12px;">
        <p style="margin:0;font-size:14px;color:#333;white-space:pre-wrap;">${f.message}</p>
      </div>
      ${button("View in Admin", f.adminUrl)}`
    ),
  }
}

// ─── Participant / user emails ────────────────────────────────────────────────

export function bookingReceived(b: {
  fullName: string
  serviceType: string
  preferredDate: string
  preferredTime: string
}): { subject: string; html: string } {
  return {
    subject: "We've received your booking request",
    html: layout(
      "Booking Received",
      `${heading(`Hi ${b.fullName},`)}
      <p style="color:#555;font-size:14px;margin:0 0 16px;">Thank you for submitting a booking request. Our team will review your details and get back to you shortly to confirm.</p>
      ${table(
        row("Service", b.serviceType) +
        row("Preferred Date", b.preferredDate) +
        row("Preferred Time", b.preferredTime)
      )}
      <p style="color:#555;font-size:13px;margin:20px 0 0;">If you have any questions, please contact us at <a href="mailto:info@careinourhand.com.au" style="color:#620E87;">info@careinourhand.com.au</a>.</p>`
    ),
  }
}

export function bookingConfirmed(b: {
  fullName: string
  serviceType: string
  preferredDate: string
  preferredTime: string
}): { subject: string; html: string } {
  return {
    subject: "Your booking is confirmed",
    html: layout(
      "Booking Confirmed",
      `${heading(`Hi ${b.fullName},`)}
      <p style="color:#555;font-size:14px;margin:0 0 16px;">Great news — your booking has been confirmed. We look forward to supporting you.</p>
      ${table(
        row("Service", b.serviceType) +
        row("Date", b.preferredDate) +
        row("Time", b.preferredTime)
      )}
      <p style="color:#555;font-size:13px;margin:20px 0 0;">Questions? Contact us at <a href="mailto:info@careinourhand.com.au" style="color:#620E87;">info@careinourhand.com.au</a>.</p>`
    ),
  }
}
