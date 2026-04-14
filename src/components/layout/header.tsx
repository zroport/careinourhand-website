"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top info bar */}
      <div className="bg-[#620E87] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-end">
          <a
            href="tel:1300XXXXXX"
            className="flex items-center gap-1.5 hover:text-[#89C541] transition-colors"
            aria-label="Call us on 1300 XXX XXX"
          >
            <Phone className="size-3" aria-hidden="true" />
            <span>1300 XXX XXX</span>
          </a>
          <a
            href="mailto:info@careinourhand.com.au"
            className="flex items-center gap-1.5 hover:text-[#89C541] transition-colors"
            aria-label="Email us at info@careinourhand.com.au"
          >
            <Mail className="size-3" aria-hidden="true" />
            <span>info@careinourhand.com.au</span>
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3" aria-hidden="true" />
            <span>Leppington, NSW</span>
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className="bg-white border-b border-gray-100"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="Care In Our Hand — Home"
            >
              <span className="flex items-center justify-center size-8 rounded-lg bg-[#620E87]">
                <Heart className="size-4 text-white" aria-hidden="true" />
              </span>
              <span className="text-[#620E87] font-bold text-lg leading-tight hidden sm:block">
                Care In Our Hand
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-1" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-[#620E87] hover:bg-purple-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA buttons */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white transition-colors"
                asChild
              >
                <Link href="/contact">Book Now</Link>
              </Button>
              <Button
                size="sm"
                className="bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0 transition-colors"
                asChild
              >
                <Link href="/referral" aria-label="Quick Referral — for support coordinators">
                  Quick Referral
                </Link>
              </Button>
            </div>

            {/* Mobile: hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white"
                asChild
              >
                <Link href="/contact">Book Now</Link>
              </Button>

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 rounded-md text-gray-600 hover:text-[#620E87] hover:bg-purple-50 transition-colors"
                    aria-label="Open navigation menu"
                  >
                    {mobileOpen ? (
                      <X className="size-5" aria-hidden="true" />
                    ) : (
                      <Menu className="size-5" aria-hidden="true" />
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:max-w-[300px] p-0">
                  <SheetHeader className="p-4 border-b border-gray-100 bg-[#620E87]">
                    <SheetTitle className="flex items-center gap-2 text-white">
                      <Heart className="size-4" aria-hidden="true" />
                      Care In Our Hand
                    </SheetTitle>
                  </SheetHeader>

                  <nav
                    aria-label="Mobile navigation"
                    className="flex flex-col p-4 gap-1"
                  >
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:text-[#620E87] hover:bg-purple-50 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}

                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full border-[#620E87] text-[#620E87] hover:bg-[#620E87] hover:text-white"
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link href="/contact">Book Now</Link>
                      </Button>
                      <Button
                        className="w-full bg-[#89C541] hover:bg-[#6da033] text-gray-900 font-semibold border-0"
                        asChild
                        onClick={() => setMobileOpen(false)}
                      >
                        <Link href="/referral">Quick Referral</Link>
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                      <a
                        href="tel:1300XXXXXX"
                        className="flex items-center gap-2 hover:text-[#620E87] transition-colors"
                        aria-label="Call 1300 XXX XXX"
                      >
                        <Phone className="size-3.5" aria-hidden="true" />
                        1300 XXX XXX
                      </a>
                      <a
                        href="mailto:info@careinourhand.com.au"
                        className="flex items-center gap-2 hover:text-[#620E87] transition-colors"
                        aria-label="Email info@careinourhand.com.au"
                      >
                        <Mail className="size-3.5" aria-hidden="true" />
                        info@careinourhand.com.au
                      </a>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
