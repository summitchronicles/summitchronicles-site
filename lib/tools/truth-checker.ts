import path from 'node:path';
// Reuse the Node-compatible JS implementation for both runtime and tests.
// This file provides TypeScript types and typed re-exports.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - JS module without types
import * as core from '../../scripts/truth-core.js';

export type CanonicalClimbs = {
  sevenSummitsCompleted: number;
  records: Array<{
    mountain: string;
    status: 'summited' | 'turnaround' | string;
    month?: string;
    year?: number;
    note?: string;
  }>;
  neverSummited?: string[];
};

export type AllowlistConfig = {
  // Skip scanning these paths entirely (supports substring match)
  paths?: string[];
  // Ignore specific pattern hits, optionally scoped to a path
  ignores?: Array<{ pattern: string; path?: string }>;
};

export type Violation = {
  rule: 'COUNT_TOO_HIGH' | 'DENALI_2025_NOT_TURNAROUND' | 'ANNAPURNA_SUMMIT_CLAIM';
  file: string;
  line: number;
  content: string;
  snippet: string;
};

export type ScanOptions = {
  rootDir: string;
  includeDirs?: string[];
  excludeDirs?: string[];
  extensions?: string[];
  allowlist?: AllowlistConfig;
};

export const detectHigherSummitCountLine = (line: string, canonicalCompleted: number): boolean =>
  core.detectHigherSummitCountLine(line, canonicalCompleted);
export const detectDenali2025Misdescribed = (line: string): boolean =>
  core.detectDenali2025Misdescribed(line);
export const detectAnnapurnaSummitClaim = (line: string): boolean =>
  core.detectAnnapurnaSummitClaim(line);

export const scanForViolations = (
  canonical: CanonicalClimbs,
  options: ScanOptions
): Violation[] => core.scanForViolations(canonical, options);

export const loadCanonicalFromFile = (canonicalPath: string): CanonicalClimbs =>
  core.loadCanonicalFromFile(canonicalPath);

export const loadAllowlist = (allowlistPath: string): AllowlistConfig | undefined =>
  core.loadAllowlist(allowlistPath);

export const formatViolations = (violations: Violation[], rootDir: string): string =>
  core.formatViolations(violations, rootDir);

