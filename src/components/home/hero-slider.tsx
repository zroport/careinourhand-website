"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSlideData {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

interface FallbackSlide extends HeroSlideData {
  gradient: string;
  secondButtonText?: string;
  secondButtonLink?: string;
}

const fallbackSlides: FallbackSlide[] = [
  {
    id: "default-1",
    title: "Your Life, In Caring Hands.",
    subtitle:
      "Providing compassionate, culturally responsive NDIS support services across Sydney.",
    imageUrl: null,
    buttonText: "Our Services",
    buttonLink: "/services",
    secondButtonText: "Make a Referral",
    secondButtonLink: "/referral",
    gradient: "from-[#620E87] via-[#7d1aab] to-[#4a0b66]",
  },
  {
    id: "default-2",
    title: "Culturally Responsive Care",
    subtitle:
      "Supporting Sydney's diverse communities with understanding, respect, and genuine compassion.",
    imageUrl: null,
    buttonText: null,
    buttonLink: null,
    gradient: "from-[#3a0850] via-[#620E87] to-[#4a0b66]",
  },
  {
    id: "default-3",
    title: "Join Our Growing Team",
    subtitle:
      "Build a career in care. We're looking for compassionate people to make a difference.",
    imageUrl: null,
    buttonText: "View Careers",
    buttonLink: "/careers",
    gradient: "from-[#620E87] via-[#1a5c2e] to-[#0d3b1c]",
  },
];

interface HeroSliderProps {
  slides?: HeroSlideData[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const useFallback = !slides || slides.length === 0;
  const activeSlides: (HeroSlideData | FallbackSlide)[] = useFallback
    ? fallbackSlides
    : slides;

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = activeSlides[current];
  const fallbackSlide = useFallback ? (slide as FallbackSlide) : null;
  const gradient =
    fallbackSlide?.gradient ?? "from-[#620E87] via-[#7d1aab] to-[#4a0b66]";
  const isFirstFallback = useFallback && current === 0;

  return (
    <section
      className="relative overflow-hidden min-h-[88vh] flex items-center"
      aria-label="Hero section"
      aria-roledescription="carousel"
    >
      {/* Background */}
      {slide.imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(98, 14, 135, 0.7)" }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          aria-hidden="true"
        >
          <div className="absolute -top-32 -right-32 size-[600px] rounded-full bg-[#7d1aab]/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-[400px] rounded-full bg-[#4a0b66]/60 blur-2xl" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] border-[3px] border-[#89C541]/20 rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
      )}

      {/* Slide content — key forces remount so CSS animation replays */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div
          key={slide.id}
          className="max-w-3xl animate-fade-in-up"
          aria-live="polite"
          aria-atomic="true"
        >
          {isFirstFallback && (
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-[#89C541]" aria-hidden="true" />
              NDIS Registered Provider · Sydney, NSW
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            {slide.title}
          </h1>

          {slide.subtitle && (
            <p className="text-lg sm:text-xl text-purple-100 leading-relaxed mb-10 max-w-2xl">
              {slide.subtitle}
            </p>
          )}

          {(slide.buttonText || fallbackSlide?.secondButtonText) && (
            <div className="flex flex-col sm:flex-row gap-3">
              {slide.buttonText && slide.buttonLink && (
                <Button
                  size="lg"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-[#620E87] font-semibold transition-all rounded-xl px-8 h-12 text-base"
                  asChild
                >
                  <Link href={slide.buttonLink}>
                    {slide.buttonText}
                    <ArrowRight className="size-4 ml-1" aria-hidden="true" />
                  </Link>
                </Button>
              )}
              {fallbackSlide?.secondButtonText && fallbackSlide.secondButtonLink && (
                <Button
                  size="lg"
                  className="bg-[#89C541] hover:bg-[#6FA334] text-white font-semibold border-0 rounded-xl px-8 h-12 text-base transition-all shadow-lg shadow-[#89C541]/30"
                  asChild
                >
                  <Link href={fallbackSlide.secondButtonLink}>
                    {fallbackSlide.secondButtonText}
                  </Link>
                </Button>
              )}
            </div>
          )}

          {isFirstFallback && (
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-purple-200 text-sm">
              <span className="flex items-center gap-2">
                <span className="size-1.5 bg-[#89C541] rounded-full" aria-hidden="true" />
                Culturally Responsive Care
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 bg-[#89C541] rounded-full" aria-hidden="true" />
                South-West Sydney Based
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 bg-[#89C541] rounded-full" aria-hidden="true" />
                24/7 Support Available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Arrow navigation */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Dot navigation */}
      {activeSlides.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {activeSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white w-6 h-2"
                  : "bg-white/50 w-2 h-2 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
