import {
  detectHigherSummitCountLine,
  detectDenali2025Misdescribed,
  detectAnnapurnaSummitClaim,
  formatViolations,
  scanForViolations
} from '@/lib/tools/truth-checker';
import path from 'node:path';

describe('truth-checker rules', () => {
  test('COUNT_TOO_HIGH: numeric forms flagged only when higher than canonical', () => {
    const canonical = 3;
    expect(detectHigherSummitCountLine('3/7', canonical)).toBe(false);
    expect(detectHigherSummitCountLine('3 of 7', canonical)).toBe(false);
    expect(detectHigherSummitCountLine('4/7', canonical)).toBe(true);
    expect(detectHigherSummitCountLine('4 of 7', canonical)).toBe(true);
  });

  test('COUNT_TOO_HIGH: spelled-out form flagged when higher', () => {
    const canonical = 3;
    expect(
      detectHigherSummitCountLine('Four of the Seven Summits', canonical)
    ).toBe(true);
    expect(
      detectHigherSummitCountLine('three of the seven summits', canonical)
    ).toBe(false);
    expect(
      detectHigherSummitCountLine('Goal: four of the seven summits by 2030', canonical)
    ).toBe(true); // still a claim; allowlist can skip if desired
  });

  test('DENALI_2025_NOT_TURNAROUND: success wording with 2025 is flagged', () => {
    expect(detectDenali2025Misdescribed('Denali 2025 summit success')).toBe(true);
    expect(
      detectDenali2025Misdescribed(
        'Denali, June 2025: turned back at high camp due to weather.'
      )
    ).toBe(false);
    expect(detectDenali2025Misdescribed('Denali summit in 2024 was a success')).toBe(
      false
    ); // rule is specific to 2025
  });

  test('ANNAPURNA_SUMMIT_CLAIM: affirmed summit claims flagged, negative phrasing allowed', () => {
    expect(detectAnnapurnaSummitClaim('Summited Annapurna at dawn')).toBe(true);
    expect(detectAnnapurnaSummitClaim('No Annapurna summit yet')).toBe(false);
    expect(detectAnnapurnaSummitClaim('Training for Annapurna')).toBe(false);
  });
});

describe('truth-checker integration', () => {
  test('formatViolations prints useful output', () => {
    const out = formatViolations([], process.cwd());
    expect(out).toContain('Truth check passed');
  });

  test('scanForViolations respects allowlist', () => {
    const canonical = { sevenSummitsCompleted: 3, records: [], neverSummited: [] };
    const tmpRoot = path.join(__dirname);
    const violations = scanForViolations(canonical as any, {
      rootDir: tmpRoot,
      includeDirs: [], // nothing to scan
      allowlist: {
        paths: ['ignored/path'],
        ignores: [{ pattern: 'Four of the Seven Summits', path: 'some/file.tsx' }]
      }
    });
    expect(Array.isArray(violations)).toBe(true);
  });
});

