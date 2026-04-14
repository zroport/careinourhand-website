const stats = [
  { value: "10+", label: "NDIS Services" },
  { value: "100%", label: "NDIS Price Guide" },
  { value: "24/7", label: "Support Available" },
  { value: "1", label: "Community Focus: Sydney" },
];

export function StatsBar() {
  return (
    <section
      className="relative overflow-hidden bg-[#89C541] py-14 sm:py-16"
      aria-label="Key statistics"
    >
      {/* Subtle decorative shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 size-36 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd
                className="text-4xl sm:text-5xl font-black text-gray-900 leading-none mb-2"
                aria-label={`${stat.value} ${stat.label}`}
              >
                {stat.value}
              </dd>
              <span className="text-sm font-semibold text-gray-800 leading-snug max-w-[120px]">
                {stat.label}
              </span>
              {/* Divider — hidden on last item on large screens */}
              {index < stats.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute h-10 w-px bg-gray-900/15"
                  style={{ left: `${((index + 1) / stats.length) * 100}%` }}
                />
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
