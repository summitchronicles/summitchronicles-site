import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteWireframePreview } from '@/app/components/wireframes/SiteWireframePreview';
import {
  siteWireframes,
  siteWireframesBySlug,
} from '@/app/components/wireframes/site-wireframes';

type WireframePageParams = {
  slug: string;
};

export async function generateStaticParams() {
  return siteWireframes.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<WireframePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = siteWireframesBySlug[slug];

  if (!page) {
    return {};
  }

  return {
    title: `${page.name} Wireframe`,
    description: page.description,
  };
}

export default async function WireframeDetailPage({
  params,
}: {
  params: Promise<WireframePageParams>;
}) {
  const { slug } = await params;
  const pageIndex = siteWireframes.findIndex((entry) => entry.slug === slug);

  if (pageIndex === -1) {
    notFound();
  }

  const page = siteWireframes[pageIndex];
  const previousPage = pageIndex > 0 ? siteWireframes[pageIndex - 1] : undefined;
  const nextPage =
    pageIndex < siteWireframes.length - 1
      ? siteWireframes[pageIndex + 1]
      : undefined;

  return (
    <SiteWireframePreview
      page={page}
      previousPage={previousPage}
      nextPage={nextPage}
    />
  );
}
