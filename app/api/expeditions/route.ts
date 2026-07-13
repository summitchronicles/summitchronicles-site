import { NextResponse } from 'next/server';
import { queries, sanityClient, urlFor } from '@/lib/sanity/client';
import {
  FALLBACK_EXPEDITIONS,
  type ExpeditionRecord,
} from '@/lib/expeditions/catalog';

export async function GET() {
  try {
    const documents = await sanityClient.fetch(queries.allExpeditions);
    const expeditions = documents.map(normalizeExpedition);

    return NextResponse.json({
      expeditions: expeditions.length ? expeditions : FALLBACK_EXPEDITIONS,
      source: expeditions.length ? 'sanity' : 'local-fallback',
    });
  } catch (error) {
    console.error('Sanity expeditions could not be loaded:', error);
    return NextResponse.json({
      expeditions: FALLBACK_EXPEDITIONS,
      source: 'local-fallback',
    });
  }
}

function normalizeExpedition(document: any): ExpeditionRecord {
  const date = document.displayDate || formatDate(document.startDate);
  const year = document.year
    ? String(document.year)
    : document.startDate
      ? String(new Date(document.startDate).getUTCFullYear())
      : extractYear(date);

  return {
    id: document.slug?.current || document._id,
    mountain: document.mountain || document.name,
    elevation: document.elevationFeet
      ? `${Number(document.elevationFeet).toLocaleString('en-US')} ft`
      : 'Elevation not recorded',
    location: document.location || 'Location not recorded',
    date,
    year,
    status: document.status,
    image: document.coverImage
      ? urlFor(document.coverImage).width(1400).height(1000).url()
      : document.legacyImagePath || '/images/sunith-visionary-planning.png',
    story: document.summary,
    stats: {
      duration: document.stats?.duration || 'Not recorded',
      difficulty: document.stats?.difficulty || 'Not recorded',
      temperature: document.stats?.temperature || 'Not recorded',
    },
    isSevenSummit: Boolean(document.isSevenSummit),
  };
}

function formatDate(value?: string) {
  if (!value) return 'Date not recorded';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function extractYear(value: string) {
  return value.match(/\b(19|20)\d{2}\b/)?.[0] || 'TBD';
}
