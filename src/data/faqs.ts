export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  label: string
  faqs: FaqItem[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    faqs: [
      {
        id: "gs-1",
        question: "How do I become a participant with Care In Our Hand?",
        answer:
          "Getting started is easy. You can submit a referral through our Referral Portal, call us directly, or ask your Support Coordinator to get in touch. We'll arrange an initial meeting to understand your needs and goals, then work with you to create a personalised support plan.",
      },
      {
        id: "gs-2",
        question: "Do I need an NDIS plan to access your services?",
        answer:
          "Yes, our services are funded through the NDIS. You'll need an active NDIS plan with funding allocated to the relevant support categories. If you're not sure whether your plan covers our services, contact us and we'll help you figure it out.",
      },
      {
        id: "gs-3",
        question: "What areas do you service?",
        answer:
          "We're based in Leppington, NSW and primarily service the South-West Sydney region. However, we may be able to accommodate participants in surrounding areas. Please contact us to discuss your location.",
      },
    ],
  },
  {
    id: "services-support",
    label: "Services & Support",
    faqs: [
      {
        id: "ss-1",
        question: "Can I choose my own support worker?",
        answer:
          "Absolutely. Choice and control is at the heart of everything we do. We'll introduce you to available support workers and you can choose who you're most comfortable with. If at any time you'd like to change, just let us know.",
      },
      {
        id: "ss-2",
        question: "Do you have current SIL vacancies?",
        answer:
          "Our SIL availability changes regularly. Please contact us directly or submit a referral to get the most up-to-date information on available vacancies in our supported living arrangements.",
      },
      {
        id: "ss-3",
        question: "What happens if I need to cancel a shift?",
        answer:
          "We understand that plans change. We ask for at least 48 hours' notice for cancellations where possible. Short-notice cancellations may be charged in accordance with the NDIS Price Guide cancellation policy. We'll always work with you to reschedule.",
      },
      {
        id: "ss-4",
        question: "Do you provide 24/7 support?",
        answer:
          "Yes, we offer round-the-clock support for participants who need it. This includes overnight assistance, sleepover shifts, and active night support. Contact us to discuss your specific requirements.",
      },
    ],
  },
  {
    id: "pricing-plans",
    label: "Pricing & Plans",
    faqs: [
      {
        id: "pp-1",
        question: "Do you charge according to the NDIS Price Guide?",
        answer:
          "Yes, all our services are priced in accordance with the current NDIS Price Guide. We are fully transparent about our pricing and will always discuss costs with you before any service begins.",
      },
      {
        id: "pp-2",
        question: "Do you charge travel fees?",
        answer:
          "Travel charges are applied in accordance with the NDIS Price Guide where applicable. We'll always inform you of any travel costs before they're incurred, and we work to minimise travel charges wherever possible.",
      },
      {
        id: "pp-3",
        question: "I'm self-managed. Can I still use your services?",
        answer:
          "Yes! We work with all NDIS management types — self-managed, plan-managed, and NDIA-managed. For self-managed participants, we provide clear invoices that make it easy for you to manage your claims.",
      },
    ],
  },
  {
    id: "safety-quality",
    label: "Safety & Quality",
    faqs: [
      {
        id: "sq-1",
        question: "Are your workers screened and qualified?",
        answer:
          "Every single one of our support workers holds a current NDIS Worker Screening Check (Yellow Card), a valid Working With Children Check, current First Aid and CPR certification, and has completed comprehensive induction training. Your safety is our top priority.",
      },
      {
        id: "sq-2",
        question: "How do I provide feedback or make a complaint?",
        answer:
          "We welcome all feedback. You can submit feedback or complaints through our Feedback & Complaints page, call us directly, or speak to your support worker. All complaints are taken seriously, handled confidentially, and resolved promptly.",
      },
    ],
  },
]

export const allFaqs: FaqItem[] = faqCategories.flatMap((c) => c.faqs)
