import {
  Briefcase,
  RefreshCcw,
  UserCheck,
  Car,
  Stethoscope,
  Home,
  BookOpen,
  Sparkles,
  Users,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  heroDescription: string;
  fullDescription: string;
  whatWeProvide: string[];
  whoIsThisFor: string;
  ndisCategory: string;
  image?: string | null;
  brochureUrl?: string | null;
}

export const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  RefreshCcw,
  UserCheck,
  Car,
  Stethoscope,
  Home,
  BookOpen,
  Sparkles,
  Users,
  PlayCircle,
};

export const services: Service[] = [
  {
    slug: "assist-employment",
    title: "Assist Access/Maintain Employment",
    shortDescription: "Building your career confidence and workplace skills",
    icon: "Briefcase",
    heroDescription:
      "We help you succeed in your career journey. Whether you're looking for your first job or want to stay confident in your current role, we work with you to build the skills you need.",
    fullDescription:
      "Employment is about more than just earning an income — it's about purpose, independence, and being part of something bigger. At Care In Our Hand, we provide tailored employment support that meets you exactly where you are.\n\nFrom preparing for interviews and writing resumes to on-the-job coaching and workplace adjustments, our experienced support workers walk alongside you every step of the way. We work closely with employers in the Sydney region to create inclusive opportunities.\n\nOur approach is always person-centred. We take the time to understand your strengths, interests, and career goals, then build a practical plan to help you achieve them.",
    whatWeProvide: [
      "Resume writing and interview preparation",
      "Job search assistance and applications",
      "On-the-job coaching and mentoring",
      "Workplace skills development",
      "Employer liaison and advocacy",
      "Transition-to-work planning",
    ],
    whoIsThisFor:
      "NDIS participants who want to find employment, maintain their current job, or develop workplace skills for future career goals.",
    ndisCategory: "Finding and Keeping a Job",
  },
  {
    slug: "life-stages-transition",
    title: "Life Stages, Transition & Support",
    shortDescription: "Smooth support through life's big changes",
    icon: "RefreshCcw",
    heroDescription:
      "Life is full of big changes, and we make sure you don't face them alone. Whether you're moving house, starting education, or transitioning to independent living, we're here.",
    fullDescription:
      "Major life transitions can feel overwhelming, but with the right support, they become exciting opportunities for growth. Care In Our Hand specialises in helping you navigate these pivotal moments with confidence.\n\nWhether you're leaving school and entering the workforce, moving from the family home into supported or independent living, or adjusting to a new phase of life, we provide structured planning and hands-on support.\n\nOur team creates individualised transition plans that break big changes into manageable steps. We coordinate with other providers, family members, and stakeholders to ensure nothing falls through the cracks.",
    whatWeProvide: [
      "Moving house and settling into new living arrangements",
      "School-to-work transition planning",
      "Independent living preparation",
      "Education pathway support",
      "Life skills for new life stages",
      "Coordination with other support services",
    ],
    whoIsThisFor:
      "NDIS participants going through significant life changes such as leaving school, moving homes, or transitioning to greater independence.",
    ndisCategory: "Assist-Life Stages, Transition and Supports",
  },
  {
    slug: "personal-activities",
    title: "Assist Personal Activities",
    shortDescription: "Respectful help with daily personal routines",
    icon: "UserCheck",
    heroDescription:
      "We provide respectful, dignified support with your daily personal routines. Our goal is to help you feel comfortable and confident, giving you a great start to every day.",
    fullDescription:
      "Personal care is one of the most intimate forms of support, and at Care In Our Hand, we approach it with the utmost respect and sensitivity. We understand that inviting someone to help with personal routines requires trust.\n\nOur carefully selected support workers are trained not only in practical personal care skills but also in cultural sensitivity, communication, and dignity of care. We match you with workers who understand your preferences and background.\n\nWhether you need daily assistance or occasional support, we tailor our approach to your comfort level and always prioritise your choice and control.",
    whatWeProvide: [
      "Showering and bathing assistance",
      "Dressing and grooming support",
      "Medication reminders and health monitoring",
      "Mealtime assistance",
      "Mobility and transfer support",
      "Overnight and morning routine care",
    ],
    whoIsThisFor:
      "NDIS participants who need support with personal self-care activities to maintain their health, hygiene, and wellbeing.",
    ndisCategory: "Assist Personal Activities",
  },
  {
    slug: "travel-transport",
    title: "Travel & Transport",
    shortDescription: "Safe, reliable transport to wherever you need to go",
    icon: "Car",
    heroDescription:
      "Getting from A to B should never be a barrier. We provide safe, reliable transport for appointments, shopping, social activities, and help you build confidence using public transport.",
    fullDescription:
      "Transport is the key that unlocks everything else — medical appointments, social events, shopping, work, and community participation. Without reliable transport, life becomes unnecessarily limited.\n\nCare In Our Hand provides both direct transport services and travel training. Our support workers can drive you to your appointments and activities, or work with you to build the skills and confidence to use public transport independently.\n\nWe cover the entire Sydney metropolitan area, with a particular focus on South-West Sydney. Our vehicles are safe, clean, and our drivers are patient and understanding.",
    whatWeProvide: [
      "Door-to-door transport for medical appointments",
      "Transport to social and community activities",
      "Grocery shopping and errand transport",
      "Public transport training and confidence building",
      "School and workplace transport",
      "Accompaniment during travel for safety",
    ],
    whoIsThisFor:
      "NDIS participants who need transport assistance to access the community, attend appointments, or learn to travel independently.",
    ndisCategory: "Assist-Travel/Transport",
  },
  {
    slug: "community-nursing",
    title: "Community Nursing Care for High Needs",
    shortDescription: "Expert clinical care in the comfort of your home",
    icon: "Stethoscope",
    heroDescription:
      "For those who require specialised medical attention, our professional nursing team provides expert clinical care within the comfort of your own home.",
    fullDescription:
      "Some health needs require more than general support — they require qualified clinical expertise. Care In Our Hand's community nursing service brings hospital-level care into your home, managed with skill, kindness, and safety.\n\nOur registered nurses are experienced in managing complex health conditions, wound care, medication management, and clinical monitoring. They work as part of your broader care team, liaising with GPs, specialists, and allied health professionals.\n\nWe understand that high clinical needs can be stressful for both participants and families. That's why our nursing team takes extra care to communicate clearly, involve you in decisions, and create an environment of trust.",
    whatWeProvide: [
      "Complex wound care and management",
      "Medication administration and management",
      "Clinical health monitoring and assessments",
      "Catheter and continence care",
      "PEG feeding support",
      "Coordination with medical professionals",
    ],
    whoIsThisFor:
      "NDIS participants with complex or high-level health needs that require professional nursing care delivered at home.",
    ndisCategory: "Community Nursing Care for High Needs",
  },
  {
    slug: "daily-tasks-shared-living",
    title: "Daily Tasks & Shared Living",
    shortDescription: "Creating a harmonious and supported home life",
    icon: "Home",
    heroDescription:
      "Living in a shared home or your own place should be easy and enjoyable. We help with daily household tasks to create a comfortable, harmonious living environment.",
    fullDescription:
      "Your home should be your sanctuary — a place where you feel comfortable, safe, and supported. Care In Our Hand helps make that possible by providing practical daily living support tailored to your household.\n\nWhether you're living independently, in shared accommodation, or in a Supported Independent Living (SIL) arrangement, our team handles the behind-the-scenes tasks that keep a home running smoothly.\n\nWe focus on creating an environment where you can thrive, not just survive. From meal planning and preparation to keeping shared spaces clean and organised, we ensure your home life supports your wellbeing.",
    whatWeProvide: [
      "Meal planning and preparation",
      "Light cleaning and tidying of living spaces",
      "Laundry and ironing",
      "Grocery shopping and household errands",
      "Organising shared living schedules",
      "Overnight and 24/7 in-home support",
    ],
    whoIsThisFor:
      "NDIS participants living independently or in shared accommodation who need support with daily household management.",
    ndisCategory: "Assist Daily Tasks/Shared Living",
  },
  {
    slug: "daily-living-life-skills",
    title: "Daily Living & Life Skills",
    shortDescription: "Building independence with practical life skills",
    icon: "BookOpen",
    heroDescription:
      "We believe in empowering you to do more for yourself. We work with you to build practical skills like cooking, budgeting, and technology — giving you tools for independence.",
    fullDescription:
      "Independence isn't about doing everything alone — it's about having the skills and confidence to make choices about your own life. Care In Our Hand's life skills program is designed to build your capabilities one step at a time.\n\nOur experienced support workers use a coaching approach, working alongside you rather than doing things for you. Whether it's learning to cook a healthy meal, managing a budget, using public transport, or navigating technology, we break complex tasks into manageable steps.\n\nEvery person's learning style is different, and we adapt our approach to suit you. We celebrate your progress, no matter how small, because every new skill is a step toward greater independence.",
    whatWeProvide: [
      "Cooking and nutrition education",
      "Money management and budgeting skills",
      "Technology and digital literacy training",
      "Personal safety and awareness",
      "Time management and routine building",
      "Social skills and communication development",
    ],
    whoIsThisFor:
      "NDIS participants who want to develop practical life skills to live more independently and confidently.",
    ndisCategory: "Development of Daily Living and Life Skills",
  },
  {
    slug: "household-tasks",
    title: "Household Tasks",
    shortDescription: "Keeping your living space fresh and organized",
    icon: "Sparkles",
    heroDescription:
      "A clean and tidy home makes a big difference in how you feel. We take care of the heavy lifting so you can relax and enjoy your space.",
    fullDescription:
      "The state of your home directly impacts your mental health, comfort, and overall quality of life. When household tasks become difficult to manage, it can affect everything from your mood to your physical safety.\n\nCare In Our Hand's household task support takes the burden off your shoulders. Our reliable support workers help maintain a clean, safe, and comfortable living environment so you can focus on what matters most to you.\n\nWe understand that everyone has different standards and preferences for their home. We work with you to establish routines and priorities that suit your lifestyle, ensuring your space feels like yours.",
    whatWeProvide: [
      "Vacuuming, mopping, and general cleaning",
      "Laundry, ironing, and linen changes",
      "Dishwashing and kitchen maintenance",
      "Bathroom and toilet cleaning",
      "Garden maintenance and outdoor tidying",
      "Decluttering and organising spaces",
    ],
    whoIsThisFor:
      "NDIS participants who need regular assistance maintaining a clean, safe, and comfortable home environment.",
    ndisCategory: "Household Tasks",
  },
  {
    slug: "community-social-participation",
    title: "Community & Social Participation",
    shortDescription: "Staying connected and active in your community",
    icon: "Users",
    heroDescription:
      "Staying connected to your community is vital for happiness and wellbeing. We help you get involved in local events, activities, and social connections.",
    fullDescription:
      "Humans are social beings, and community connection is essential for mental health, personal growth, and happiness. Care In Our Hand is passionate about helping you build and maintain meaningful connections in your local community.\n\nOur support workers accompany you to community events, social gatherings, sporting activities, cultural celebrations, and recreational outings. We don't just take you there — we support you to actively participate and build lasting relationships.\n\nWhether you want to join a local club, volunteer, attend community events in South-West Sydney, or simply enjoy a coffee with friends, we make it happen. We're there to support you in being an active, valued member of your neighbourhood.",
    whatWeProvide: [
      "Accompanying to community events and activities",
      "Support to join clubs, groups, and organisations",
      "Social outings with friends and peers",
      "Volunteering support",
      "Cultural and religious event participation",
      "Recreational activities and hobbies",
    ],
    whoIsThisFor:
      "NDIS participants who want to be more active in their community, build social connections, and participate in local events.",
    ndisCategory: "Participation in Community, Social and Civic Activities",
  },
  {
    slug: "group-centre-activities",
    title: "Group & Centre-Based Activities",
    shortDescription: "Fun group programs to learn, play, and connect",
    icon: "PlayCircle",
    heroDescription:
      "Our centre-based programs are all about connection and fun. We offer group activities where you can learn new hobbies, play sports, or make art alongside others.",
    fullDescription:
      "Group activities offer something unique — the chance to learn, grow, and connect with others who share similar interests. Care In Our Hand's centre-based programs create a safe, welcoming space for participants to try new things and build friendships.\n\nOur programs are carefully designed to be inclusive and accessible, with activities ranging from arts and crafts to sports, music, cooking classes, and educational workshops. Each session is facilitated by trained support workers who ensure everyone feels included.\n\nWe believe that fun is a legitimate goal. While our programs build valuable skills like teamwork, communication, and creativity, they're also simply enjoyable. Making friends and sharing great experiences in a supportive environment is what it's all about.",
    whatWeProvide: [
      "Arts, crafts, and creative workshops",
      "Sports and physical activity programs",
      "Cooking and nutrition classes",
      "Music and performing arts sessions",
      "Educational and skill-building workshops",
      "Social events and community outings",
    ],
    whoIsThisFor:
      "NDIS participants who enjoy group settings and want to build skills, make friends, and have fun in a safe, supervised environment.",
    ndisCategory: "Group/Centre Activities",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(currentSlug: string): Service[] {
  const index = services.findIndex((s) => s.slug === currentSlug);
  const total = services.length;
  return [
    services[(index + 1) % total],
    services[(index + 2) % total],
    services[(index + 3) % total],
  ];
}
