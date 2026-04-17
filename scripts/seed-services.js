const { Client } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { randomBytes } = require("crypto");
function cuid() {
  return "c" + randomBytes(11).toString("base64url").slice(0, 24);
}

const services = [
  {
    slug: "assist-employment",
    title: "Assist Access/Maintain Employment",
    summary: "Building your career confidence and workplace skills",
    description:
      "Employment is about more than just earning an income — it's about purpose, independence, and being part of something bigger. At Care In Our Hand, we provide tailored employment support that meets you exactly where you are.\n\nFrom preparing for interviews and writing resumes to on-the-job coaching and workplace adjustments, our experienced support workers walk alongside you every step of the way. We work closely with employers in the Sydney region to create inclusive opportunities.\n\nOur approach is always person-centred. We take the time to understand your strengths, interests, and career goals, then build a practical plan to help you achieve them.",
    icon: "Briefcase",
    order: 1,
  },
  {
    slug: "life-stages-transition",
    title: "Life Stages, Transition & Support",
    summary: "Smooth support through life's big changes",
    description:
      "Major life transitions can feel overwhelming, but with the right support, they become exciting opportunities for growth. Care In Our Hand specialises in helping you navigate these pivotal moments with confidence.\n\nWhether you're leaving school and entering the workforce, moving from the family home into supported or independent living, or adjusting to a new phase of life, we provide structured planning and hands-on support.\n\nOur team creates individualised transition plans that break big changes into manageable steps. We coordinate with other providers, family members, and stakeholders to ensure nothing falls through the cracks.",
    icon: "RefreshCcw",
    order: 2,
  },
  {
    slug: "personal-activities",
    title: "Assist Personal Activities",
    summary: "Respectful help with daily personal routines",
    description:
      "Personal care is one of the most intimate forms of support, and at Care In Our Hand, we approach it with the utmost respect and sensitivity. We understand that inviting someone to help with personal routines requires trust.\n\nOur carefully selected support workers are trained not only in practical personal care skills but also in cultural sensitivity, communication, and dignity of care. We match you with workers who understand your preferences and background.\n\nWhether you need daily assistance or occasional support, we tailor our approach to your comfort level and always prioritise your choice and control.",
    icon: "UserCheck",
    order: 3,
  },
  {
    slug: "travel-transport",
    title: "Travel & Transport",
    summary: "Safe, reliable transport to wherever you need to go",
    description:
      "Transport is the key that unlocks everything else — medical appointments, social events, shopping, work, and community participation. Without reliable transport, life becomes unnecessarily limited.\n\nCare In Our Hand provides both direct transport services and travel training. Our support workers can drive you to your appointments and activities, or work with you to build the skills and confidence to use public transport independently.\n\nWe cover the entire Sydney metropolitan area, with a particular focus on South-West Sydney. Our vehicles are safe, clean, and our drivers are patient and understanding.",
    icon: "Car",
    order: 4,
  },
  {
    slug: "community-nursing",
    title: "Community Nursing Care for High Needs",
    summary: "Expert clinical care in the comfort of your home",
    description:
      "Some health needs require more than general support — they require qualified clinical expertise. Care In Our Hand's community nursing service brings hospital-level care into your home, managed with skill, kindness, and safety.\n\nOur registered nurses are experienced in managing complex health conditions, wound care, medication management, and clinical monitoring. They work as part of your broader care team, liaising with GPs, specialists, and allied health professionals.\n\nWe understand that high clinical needs can be stressful for both participants and families. That's why our nursing team takes extra care to communicate clearly, involve you in decisions, and create an environment of trust.",
    icon: "Stethoscope",
    order: 5,
  },
  {
    slug: "daily-tasks-shared-living",
    title: "Daily Tasks & Shared Living",
    summary: "Creating a harmonious and supported home life",
    description:
      "Your home should be your sanctuary — a place where you feel comfortable, safe, and supported. Care In Our Hand helps make that possible by providing practical daily living support tailored to your household.\n\nWhether you're living independently, in shared accommodation, or in a Supported Independent Living (SIL) arrangement, our team handles the behind-the-scenes tasks that keep a home running smoothly.\n\nWe focus on creating an environment where you can thrive, not just survive. From meal planning and preparation to keeping shared spaces clean and organised, we ensure your home life supports your wellbeing.",
    icon: "Home",
    order: 6,
  },
  {
    slug: "daily-living-life-skills",
    title: "Daily Living & Life Skills",
    summary: "Building independence with practical life skills",
    description:
      "Independence isn't about doing everything alone — it's about having the skills and confidence to make choices about your own life. Care In Our Hand's life skills program is designed to build your capabilities one step at a time.\n\nOur experienced support workers use a coaching approach, working alongside you rather than doing things for you. Whether it's learning to cook a healthy meal, managing a budget, using public transport, or navigating technology, we break complex tasks into manageable steps.\n\nEvery person's learning style is different, and we adapt our approach to suit you. We celebrate your progress, no matter how small, because every new skill is a step toward greater independence.",
    icon: "BookOpen",
    order: 7,
  },
  {
    slug: "household-tasks",
    title: "Household Tasks",
    summary: "Keeping your living space fresh and organized",
    description:
      "The state of your home directly impacts your mental health, comfort, and overall quality of life. When household tasks become difficult to manage, it can affect everything from your mood to your physical safety.\n\nCare In Our Hand's household task support takes the burden off your shoulders. Our reliable support workers help maintain a clean, safe, and comfortable living environment so you can focus on what matters most to you.\n\nWe understand that everyone has different standards and preferences for their home. We work with you to establish routines and priorities that suit your lifestyle, ensuring your space feels like yours.",
    icon: "Sparkles",
    order: 8,
  },
  {
    slug: "community-social-participation",
    title: "Community & Social Participation",
    summary: "Staying connected and active in your community",
    description:
      "Humans are social beings, and community connection is essential for mental health, personal growth, and happiness. Care In Our Hand is passionate about helping you build and maintain meaningful connections in your local community.\n\nOur support workers accompany you to community events, social gatherings, sporting activities, cultural celebrations, and recreational outings. We don't just take you there — we support you to actively participate and build lasting relationships.\n\nWhether you want to join a local club, volunteer, attend community events in South-West Sydney, or simply enjoy a coffee with friends, we make it happen. We're there to support you in being an active, valued member of your neighbourhood.",
    icon: "Users",
    order: 9,
  },
  {
    slug: "group-centre-activities",
    title: "Group & Centre-Based Activities",
    summary: "Fun group programs to learn, play, and connect",
    description:
      "Group activities offer something unique — the chance to learn, grow, and connect with others who share similar interests. Care In Our Hand's centre-based programs create a safe, welcoming space for participants to try new things and build friendships.\n\nOur programs are carefully designed to be inclusive and accessible, with activities ranging from arts and crafts to sports, music, cooking classes, and educational workshops. Each session is facilitated by trained support workers who ensure everyone feels included.\n\nWe believe that fun is a legitimate goal. While our programs build valuable skills like teamwork, communication, and creativity, they're also simply enjoyable. Making friends and sharing great experiences in a supportive environment is what it's all about.",
    icon: "PlayCircle",
    order: 10,
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

    for (const service of services) {
      const id = cuid();
      const result = await client.query(
        `INSERT INTO "Service" (id, title, slug, summary, description, icon, "order", "isActive", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [id, service.title, service.slug, service.summary, service.description, service.icon, service.order, true, now, now]
      );
      if (result.rowCount > 0) inserted++;
    }

    console.log(`✅ Seeded ${inserted} services (${services.length - inserted} already existed)`);
  } catch (err) {
    console.error("ERROR seeding services:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
