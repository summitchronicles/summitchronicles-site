import { getCliClient } from 'sanity/cli';
import { FALLBACK_EXPEDITIONS } from '../lib/expeditions/catalog';

const client = getCliClient({ apiVersion: '2024-01-01' });
const dryRun = process.env.SANITY_MIGRATION_DRY_RUN !== 'false';

async function migrate() {
  const existingIds = new Set(
    await client.fetch<string[]>(`*[_type == "expedition"]._id`)
  );
  const documents = FALLBACK_EXPEDITIONS.map((expedition) => ({
    _id: `expedition.${expedition.id}`,
    _type: 'expedition',
    name: expedition.mountain,
    slug: { _type: 'slug', current: expedition.id },
    mountain: expedition.mountain,
    location: expedition.location,
    elevationFeet: parseElevation(expedition.elevation),
    displayDate: expedition.date,
    year: Number(expedition.year),
    status: expedition.status,
    summary: expedition.story,
    legacyImagePath: expedition.image,
    isSevenSummit: expedition.isSevenSummit,
    stats: expedition.stats,
    isPublic: true,
  }));
  const pending = documents.filter(
    (document) => !existingIds.has(document._id)
  );

  console.log(
    JSON.stringify(
      {
        dryRun,
        existing: documents.length - pending.length,
        pending: pending.length,
        ids: pending.map((document) => document._id),
      },
      null,
      2
    )
  );

  if (dryRun || pending.length === 0) return;

  let transaction = client.transaction();
  pending.forEach((document) => {
    transaction = transaction.createIfNotExists(document);
  });
  await transaction.commit();
  console.log(`Created ${pending.length} expedition records.`);
}

function parseElevation(value: string) {
  const parsed = Number(value.replace(/[^0-9]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

migrate().catch((error) => {
  console.error('Expedition migration failed:', error);
  process.exitCode = 1;
});
