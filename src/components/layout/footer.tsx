import Link from "next/link";
import { Heart, Phone, Mail, MapPin, Shield, CheckCircle } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Feedback & Complaints", href: "/feedback" },
];

const serviceLinks = [
  { label: "Assist Employment", href: "/services#employment" },
  { label: "Life Stages & Transitions", href: "/services#life-stages" },
  { label: "Personal Activities", href: "/services#personal-activities" },
  { label: "Travel & Transport", href: "/services#transport" },
  { label: "Community Nursing", href: "/services#nursing" },
];

interface FooterProps {
  phone?: string
  email?: string
  abn?: string
}

export function Footer({
  phone = "1300 XXX XXX",
  email = "info@careinourhand.com.au",
  abn = "XX XXX XXX XXX",
}: FooterProps) {
  return (
    <footer className="bg-[#0f0a1a] text-gray-300" aria-label="Site footer">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Care In Our Hand — Home"
            >
              <span className="flex items-center justify-center size-9 rounded-lg bg-[#620E87] group-hover:bg-[#4e0b6b] transition-colors">
                <Heart className="size-5 text-white" aria-hidden="true" />
              </span>
              <span className="text-white font-bold text-lg leading-tight">
                Care In Our Hand
              </span>
            </Link>
            <p className="text-[#89C541] font-medium italic text-sm">
              "Your Life, In Caring Hands."
            </p>
            <p className="text-sm leading-relaxed text-gray-400">
              An NDIS registered disability support provider bringing compassionate,
              culturally responsive care to communities across Sydney.
            </p>
            <div className="flex gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs bg-[#620E87]/30 text-purple-200 px-2.5 py-1 rounded-full border border-[#620E87]/40">
                <Shield className="size-3" aria-hidden="true" />
                NDIS Registered
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#89C541] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5" role="list">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#89C541] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-[#89C541] hover:text-[#a0d45a] transition-colors font-medium"
                >
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3" role="list">
              <li>
                <a
                  href="https://maps.google.com/?q=15+Gribbin+Road+Leppington+NSW+2179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-gray-400 hover:text-[#89C541] transition-colors"
                  aria-label="View our address on Google Maps"
                >
                  <MapPin className="size-4 mt-0.5 shrink-0 text-[#89C541]" aria-hidden="true" />
                  <span>
                    15 Gribbin Road
                    <br />
                    Leppington NSW 2179
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-[#89C541] transition-colors"
                  aria-label={`Call us on ${phone}`}
                >
                  <Phone className="size-4 shrink-0 text-[#89C541]" aria-hidden="true" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-[#89C541] transition-colors"
                  aria-label={`Email us at ${email}`}
                >
                  <Mail className="size-4 shrink-0 text-[#89C541]" aria-hidden="true" />
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-t border-white/10 bg-[#0a0615]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-[#89C541]" aria-hidden="true" />
              NDIS Registered Provider
            </span>
            <span className="text-white/20" aria-hidden="true">|</span>
            <span>ABN: {abn}</span>
            <span className="text-white/20" aria-hidden="true">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-[#89C541]" aria-hidden="true" />
              Worker Screening Cleared
            </span>
            <span className="text-white/20" aria-hidden="true">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="size-3.5 text-[#89C541]" aria-hidden="true" />
              WCAG 2.1 AA Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 bg-[#0a0615]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>
              © 2025 Care In Our Hand. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="hover:text-gray-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-300 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
