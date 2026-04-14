const teamMembers = [
  {
    name: "Director 1",
    role: "Co-Founder & Director",
    bio: "With over 7 years in the NSW healthcare sector, bringing deep expertise in disability support coordination and community care.",
    initials: "D1",
    gradient: "from-[#620E87]/30 to-[#89C541]/20",
  },
  {
    name: "Director 2",
    role: "Co-Founder & Operations Director",
    bio: "Over 5 years of experience in healthcare operations, passionate about creating systems that put participants first.",
    initials: "D2",
    gradient: "from-[#89C541]/30 to-[#620E87]/20",
  },
];

export function MeetTheTeam() {
  return (
    <section
      className="py-20 sm:py-24 bg-white"
      aria-labelledby="team-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest text-[#89C541] uppercase mb-3">
            The Team
          </span>
          <h2
            id="team-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Our{" "}
            <span className="text-[#620E87]">Leadership</span>
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Meet the people driving our mission forward.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-200"
              aria-label={`${member.name}, ${member.role}`}
            >
              {/* Avatar placeholder */}
              <div
                className={`size-20 rounded-full bg-gradient-to-br ${member.gradient} border-2 border-white shadow-md flex items-center justify-center mb-5`}
                aria-hidden="true"
              >
                <span className="text-xl font-bold text-[#620E87]/70">
                  {member.initials}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 mb-0.5">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-[#620E87] mb-3">
                {member.role}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {member.bio}
              </p>
            </article>
          ))}
        </div>

        {/* Coming soon note */}
        <p className="text-center text-sm text-gray-400 mt-8" aria-live="polite">
          Full team profiles coming soon
        </p>
      </div>
    </section>
  );
}
