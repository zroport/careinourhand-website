import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ContactInfoProps {
  address?: string
  phone?: string
  email?: string
  hoursWeekday?: string
  hoursSaturday?: string
  hoursSunday?: string
}

export function ContactInfo({
  address = "15 Gribbin Road\nLeppington NSW 2179",
  phone = "1300 XXX XXX",
  email = "info@careinourhand.com.au",
  hoursWeekday = "Monday – Friday: 8:00 AM – 6:00 PM",
  hoursSaturday = "Saturday: 9:00 AM – 2:00 PM",
  hoursSunday = "Sunday: Closed",
}: ContactInfoProps) {
  return (
    <div className="space-y-5">
      {/* Contact details */}
      <Card className="glass-card">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-start gap-3">
            <span
              className="flex items-center justify-center size-9 rounded-lg bg-purple-100 text-[#620E87] shrink-0"
              aria-hidden="true"
            >
              <MapPin className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Address</p>
              <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">
                {address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              className="flex items-center justify-center size-9 rounded-lg bg-purple-100 text-[#620E87] shrink-0"
              aria-hidden="true"
            >
              <Phone className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Phone</p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-sm text-[#620E87] hover:underline mt-0.5 block"
                aria-label={`Call us on ${phone}`}
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              className="flex items-center justify-center size-9 rounded-lg bg-purple-100 text-[#620E87] shrink-0"
              aria-hidden="true"
            >
              <Mail className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <a
                href={`mailto:${email}`}
                className="text-sm text-[#620E87] hover:underline mt-0.5 block"
              >
                {email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              className="flex items-center justify-center size-9 rounded-lg bg-purple-100 text-[#620E87] shrink-0"
              aria-hidden="true"
            >
              <Clock className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900">Office Hours</p>
              <div className="text-sm text-muted-foreground mt-0.5 space-y-0.5">
                <p>{hoursWeekday}</p>
                <p>{hoursSaturday}</p>
                <p>{hoursSunday}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social media */}
      <Card className="glass-card">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">Follow Us</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Follow us on Facebook"
              className="flex items-center justify-center size-10 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-bold text-sm"
            >
              f
            </a>
            <a
              href="#"
              aria-label="Follow us on Instagram"
              className="flex items-center justify-center size-10 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors font-bold text-sm"
            >
              in
            </a>
            <a
              href="#"
              aria-label="Connect with us on LinkedIn"
              className="flex items-center justify-center size-10 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors font-bold text-sm"
            >
              li
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <Card className="glass-card">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white"
            asChild
          >
            <Link href="/referral">Submit a Referral</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white"
            asChild
          >
            <Link href="/booking">Book an Appointment</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-[#89C541] text-gray-800 hover:bg-[#89C541] hover:text-gray-900"
            asChild
          >
            <Link href="/services">View Services</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
