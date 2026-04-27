interface OurStoryProps {
  heading?: string
  para1?: string
  para2?: string
  para3?: string
}

const DEFAULTS = {
  heading: "Built on Understanding",
  para1:
    "Care In Our Hand was founded in Sydney after seeing firsthand how many families struggled to find disability support that was culturally appropriate, flexible, and genuinely personal. Too often, participants were treated as numbers in a system rather than individuals with unique goals, backgrounds, and dreams.",
  para2:
    "Our founders brought together years of healthcare experience across the NSW health sector with a deep commitment to doing things differently. We believe that great care starts with understanding — understanding your culture, your language, your family dynamics, and most importantly, your choices.",
  para3:
    "Today, we're proud to serve the South-West Sydney community from our base in Leppington, providing NDIS support services that put you in the driver's seat of your own life.",
}

export function OurStory({
  heading = DEFAULTS.heading,
  para1 = DEFAULTS.para1,
  para2 = DEFAULTS.para2,
  para3 = DEFAULTS.para3,
}: OurStoryProps) {
  return (
    <section
      className="py-12 sm:py-16 section-blob-purple"
      style={{ backgroundColor: '#f8f5fc' }}
      aria-labelledby="our-story-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: text content */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest text-[#89C541] uppercase mb-3">
              Our Story
            </span>
            <h2
              id="our-story-heading"
              className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6"
            >
              {heading}
            </h2>

            <div className="space-y-5 text-gray-600 text-base leading-relaxed">
              <p>{para1}</p>
              <p>{para2}</p>
              <p>{para3}</p>
            </div>
          </div>

          {/* Right: image placeholder */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(98,14,135,0.08) 0%, rgba(137,197,65,0.08) 100%)",
                border: "1px solid rgba(98,14,135,0.12)",
              }}
              aria-label="Team photo placeholder"
            >
              {/* Pattern overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(98,14,135,0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              {/* Placeholder content */}
              <div className="relative z-10 text-center p-8">
                {/* Stacked avatar circles */}
                <div
                  className="flex justify-center mb-5"
                  aria-hidden="true"
                >
                  <div className="flex -space-x-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="size-14 rounded-full border-2 border-white"
                        style={{
                          background: `linear-gradient(135deg, rgba(98,14,135,${0.2 + i * 0.1}) 0%, rgba(137,197,65,${0.2 + i * 0.1}) 100%)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[#620E87] font-semibold text-sm">
                  Team Photo Coming Soon
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  The faces behind your care
                </p>
              </div>

              {/* Decorative corner accents */}
              <div
                aria-hidden="true"
                className="absolute top-5 right-5 size-14 rounded-xl bg-[#89C541]/20 border border-[#89C541]/30"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-5 left-5 size-10 rounded-lg bg-[#620E87]/15 border border-[#620E87]/20"
              />
            </div>

            {/* Floating badge */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 flex items-center gap-3"
            >
              <span className="flex items-center justify-center size-9 rounded-xl bg-[#620E87]/10">
                <span className="text-lg" role="img" aria-label="location pin">📍</span>
              </span>
              <div>
                <p className="text-xs font-bold text-gray-900">Leppington, NSW</p>
                <p className="text-xs text-gray-500">South-West Sydney</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
