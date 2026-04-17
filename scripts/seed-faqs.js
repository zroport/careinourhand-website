const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { randomBytes } = require("crypto");
function cuid() {
  return "c" + randomBytes(11).toString("base64url").slice(0, 24);
}

const faqs = [
  {
    question: "How do I become a participant with Care In Our Hand?",
    answer:
      "Getting started is easy. You can submit a referral through our Referral Portal, call us directly, or ask your Support Coordinator to get in touch. We'll arrange an initial meeting to understand your needs and goals, then work with you to create a personalised support plan.",
    order: 1,
  },
  {
    question: "Do I need an NDIS plan to access your services?",
    answer:
      "Yes, our services are funded through the NDIS. You'll need an active NDIS plan with funding allocated to the relevant support categories. If you're not sure whether your plan covers our services, contact us and we'll help you figure it out.",
    order: 2,
  },
  {
    question: "What areas do you service?",
    answer:
      "We're based in Leppington, NSW and primarily service the South-West Sydney region. However, we may be able to accommodate participants in surrounding areas. Please contact us to discuss your location.",
    order: 3,
  },
  {
    question: "Can I choose my own support worker?",
    answer:
      "Absolutely. Choice and control is at the heart of everything we do. We'll introduce you to available support workers and you can choose who you're most comfortable with. If at any time you'd like to change, just let us know.",
    order: 4,
  },
  {
    question: "Do you have current SIL vacancies?",
    answer:
      "Our SIL availability changes regularly. Please contact us directly or submit a referral to get the most up-to-date information on available vacancies in our supported living arrangements.",
    order: 5,
  },
  {
    question: "What happens if I need to cancel a shift?",
    answer:
      "We understand that plans change. We ask for at least 48 hours' notice for cancellations where possible. Short-notice cancellations may be charged in accordance with the NDIS Price Guide cancellation policy. We'll always work with you to reschedule.",
    order: 6,
  },
  {
    question: "Do you provide 24/7 support?",
    answer:
      "Yes, we offer round-the-clock support for participants who need it. This includes overnight assistance, sleepover shifts, and active night support. Contact us to discuss your specific requirements.",
    order: 7,
  },
  {
    question: "Do you charge according to the NDIS Price Guide?",
    answer:
      "Yes, all our services are priced in accordance with the current NDIS Price Guide. We are fully transparent about our pricing and will always discuss costs with you before any service begins.",
    order: 8,
  },
  {
    question: "Do you charge travel fees?",
    answer:
      "Travel charges are applied in accordance with the NDIS Price Guide where applicable. We'll always inform you of any travel costs before they're incurred, and we work to minimise travel charges wherever possible.",
    order: 9,
  },
  {
    question: "I'm self-managed. Can I still use your services?",
    answer:
      "Yes! We work with all NDIS management types — self-managed, plan-managed, and NDIA-managed. For self-managed participants, we provide clear invoices that make it easy for you to manage your claims.",
    order: 10,
  },
  {
    question: "Are your workers screened and qualified?",
    answer:
      "Every single one of our support workers holds a current NDIS Worker Screening Check (Yellow Card), a valid Working With Children Check, current First Aid and CPR certification, and has completed comprehensive induction training. Your safety is our top priority.",
    order: 11,
  },
  {
    question: "How do I provide feedback or make a complaint?",
    answer:
      "We welcome all feedback. You can submit feedback or complaints through our Feedback & Complaints page, call us directly, or speak to your support worker. All complaints are taken seriously, handled confidentially, and resolved promptly.",
    order: 12,
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL not found in .env");
    process.exit(1);
  }

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    const now = new Date().toISOString();
    let inserted = 0;

    for (const faq of faqs) {
      const id = cuid();
      const result = await client.query(
        `INSERT INTO "Faq" (id, question, answer, "order", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [id, faq.question, faq.answer, faq.order, true, now, now]
      );
      if (result.rowCount > 0) inserted++;
    }

    console.log(`✅ Seeded ${inserted} FAQs (${faqs.length - inserted} skipped)`);
  } catch (err) {
    console.error("ERROR seeding FAQs:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
