// Prevent SSG: Next.js 16 on Windows causes React dual-instance conflicts
// in the static generation worker. Force dynamic rendering (SSR on request).
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceBySlug, getRelatedServices } from "@/data/services";
import { ServiceHero } from "@/components/services/service-hero";
import { ServiceDescription } from "@/components/services/service-description";
import { ServiceProvides } from "@/components/services/service-provides";
import { ServiceWhoFor } from "@/components/services/service-who-for";
import { ServiceCta } from "@/components/services/service-cta";
import { ServiceRelated } from "@/components/services/service-related";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} | Care In Our Hand`,
    description: `${service.heroDescription} ${service.whoIsThisFor}`,
    keywords: [
      `${service.title} NDIS`,
      `NDIS ${service.ndisCategory}`,
      "NDIS provider Sydney",
      "disability support Sydney",
      "Care In Our Hand",
      "Leppington NDIS",
    ],
  };
}

async function getServiceMedia(slug: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.service.findUnique({
      where: { slug },
      select: {
        image: true,
        brochureUrl: true,
      },
    });
  } catch {
    return null;
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const relatedServices = getRelatedServices(slug);
  const media = await getServiceMedia(slug);
  const enrichedService = media ? { ...service, image: media.image, brochureUrl: (media as { brochureUrl?: string | null }).brochureUrl } : service;

  return (
    <>
      <ServiceHero service={enrichedService} />
      <ServiceDescription service={enrichedService} />
      <ServiceProvides service={enrichedService} />
      <ServiceWhoFor service={enrichedService} />
      <ServiceCta service={enrichedService} />
      <ServiceRelated relatedServices={relatedServices} />
    </>
  );
}
