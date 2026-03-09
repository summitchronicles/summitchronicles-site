const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EVEREST_DATE = '2028-03-01T00:00:00Z';
const SURGERY_DATE = '2025-11-10T00:00:00Z';

function getUtcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      MS_PER_DAY
  );
}

function diffUtcDays(targetDate: string, now: Date = new Date()): number {
  const target = new Date(targetDate);
  return getUtcDayNumber(target) - getUtcDayNumber(now);
}

export function getDaysToEverest(now: Date = new Date()): number {
  return Math.max(0, diffUtcDays(EVEREST_DATE, now));
}

export function getDaysSinceSurgery(now: Date = new Date()): number {
  return Math.max(0, -diffUtcDays(SURGERY_DATE, now));
}

// Format the countdown text
export function getEverestCountdownText(): string {
  const days = getDaysToEverest();

  if (days === 0) {
    return "Summit Day!";
  } else if (days === 1) {
    return "1 Day to Everest";
  } else {
    return `${days} Days to Everest`;
  }
}
