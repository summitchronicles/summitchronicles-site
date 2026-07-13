const MS_PER_DAY = 1000 * 60 * 60 * 24;
const SURGERY_DATE = '2025-11-10T00:00:00Z';

function getUtcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      MS_PER_DAY
  );
}

export function getDaysSinceSurgery(now: Date = new Date()): number {
  const surgeryDate = new Date(SURGERY_DATE);
  return Math.max(0, getUtcDayNumber(now) - getUtcDayNumber(surgeryDate));
}
