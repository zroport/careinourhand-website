export interface JobListing {
  id: string
  title: string
  location: string
  type: string
  description: string
  requirements: string[]
}

export const jobs: JobListing[] = [
  {
    id: "support-worker-community",
    title: "Support Worker — Community Participation",
    location: "Leppington, NSW & surrounding areas",
    type: "Part-time / Casual",
    description:
      "Support NDIS participants to access their community, attend social events, and build independent living skills. Must have a valid driver's licence and own vehicle.",
    requirements: [
      "NDIS Worker Screening Check",
      "First Aid Certificate",
      "Valid driver's licence",
      "Own reliable vehicle",
      "Experience in disability support (preferred but not essential)",
    ],
  },
  {
    id: "personal-care-support-worker",
    title: "Personal Care Support Worker",
    location: "Leppington, NSW & surrounding areas",
    type: "Part-time / Casual",
    description:
      "Provide respectful personal care support to NDIS participants including assistance with daily routines, hygiene, and health needs. Cultural sensitivity and empathy are essential.",
    requirements: [
      "NDIS Worker Screening Check",
      "First Aid Certificate",
      "Certificate III in Individual Support (preferred)",
      "Experience with personal care",
      "Strong communication skills",
    ],
  },
  {
    id: "registered-nurse-community",
    title: "Registered Nurse — Community",
    location: "Leppington, NSW & surrounding areas",
    type: "Full-time / Part-time",
    description:
      "Deliver high-quality clinical nursing care to NDIS participants in their homes. Manage complex health needs including wound care, medication management, and clinical assessments.",
    requirements: [
      "Current AHPRA registration",
      "NDIS Worker Screening Check",
      "Minimum 2 years clinical nursing experience",
      "Valid driver's licence",
      "Experience in community or disability nursing (preferred)",
    ],
  },
]
