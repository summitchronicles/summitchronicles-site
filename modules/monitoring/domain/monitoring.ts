export const MONITORING_ERROR_TYPES = [
  'javascript',
  'network',
  'performance',
  'security',
  'user',
] as const;

export const MONITORING_ERROR_SEVERITIES = [
  'low',
  'medium',
  'high',
  'critical',
] as const;

export const MONITORING_ENVIRONMENTS = [
  'development',
  'production',
  'staging',
] as const;

export const PERFORMANCE_ISSUE_TYPES = [
  'slow_load',
  'memory_leak',
  'large_bundle',
  'poor_lcp',
  'high_cls',
] as const;

export type MonitoringErrorType = (typeof MONITORING_ERROR_TYPES)[number];
export type MonitoringErrorSeverity =
  (typeof MONITORING_ERROR_SEVERITIES)[number];
export type MonitoringEnvironment = (typeof MONITORING_ENVIRONMENTS)[number];
export type PerformanceIssueType = (typeof PERFORMANCE_ISSUE_TYPES)[number];

export interface ErrorContext {
  userId?: string;
  sessionId: string;
  url: string;
  userAgent: string;
  timestamp: string;
  buildVersion?: string;
  environment: MonitoringEnvironment;
  metadata?: Record<string, unknown>;
}

export interface ErrorReport {
  id: string;
  type: MonitoringErrorType;
  severity: MonitoringErrorSeverity;
  message: string;
  stack?: string;
  context: ErrorContext;
  metadata?: Record<string, unknown>;
  fingerprint: string;
}

export interface PerformanceIssue {
  id: string;
  type: PerformanceIssueType;
  metric: string;
  value: number;
  threshold: number;
  context: ErrorContext;
}

export interface MonitoringPayload {
  errors: unknown[];
  performanceIssues?: unknown[];
}

export interface NormalizedMonitoringPayload {
  errors: ErrorReport[];
  performanceIssues: PerformanceIssue[];
  rejectedErrors: number;
  rejectedPerformanceIssues: number;
}

type NormalizeResult =
  | {
      ok: true;
      value: NormalizedMonitoringPayload;
    }
  | {
      ok: false;
      error: string;
    };

interface NormalizeOptions {
  maxErrors?: number;
  maxPerformanceIssues?: number;
}

const DEFAULT_MAX_ERRORS = 50;
const DEFAULT_MAX_PERFORMANCE_ISSUES = 50;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeString(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length === 0) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function sanitizeOptionalString(
  value: unknown,
  maxLength: number
): string | undefined {
  const sanitized = sanitizeString(value, maxLength);
  return sanitized ?? undefined;
}

function sanitizeNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function sanitizeMetadataValue(
  value: unknown,
  depth: number
): unknown | undefined {
  if (depth > 2) {
    return undefined;
  }

  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'number'
  ) {
    return value;
  }

  if (typeof value === 'string') {
    return value.slice(0, 500);
  }

  if (Array.isArray(value)) {
    return value
      .slice(0, 10)
      .map((entry) => sanitizeMetadataValue(entry, depth + 1))
      .filter((entry) => entry !== undefined);
  }

  if (isRecord(value)) {
    const sanitizedEntries = Object.entries(value)
      .slice(0, 10)
      .map(([key, entryValue]) => [
        key.slice(0, 100),
        sanitizeMetadataValue(entryValue, depth + 1),
      ] as const)
      .filter(([, entryValue]) => entryValue !== undefined);

    return Object.fromEntries(sanitizedEntries);
  }

  return undefined;
}

function sanitizeMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const sanitized = sanitizeMetadataValue(value, 0);
  return isRecord(sanitized) ? sanitized : undefined;
}

function sanitizeContext(value: unknown): ErrorContext | null {
  if (!isRecord(value)) {
    return null;
  }

  const sessionId = sanitizeString(value.sessionId, 120);
  const url = sanitizeString(value.url, 2048);
  const userAgent = sanitizeString(value.userAgent, 512);
  const timestamp = sanitizeString(value.timestamp, 64);
  const environment = sanitizeString(value.environment, 32);

  if (!sessionId || !url || !userAgent || !timestamp || !environment) {
    return null;
  }

  if (
    !MONITORING_ENVIRONMENTS.includes(environment as MonitoringEnvironment)
  ) {
    return null;
  }

  return {
    sessionId,
    url,
    userAgent,
    timestamp,
    environment: environment as MonitoringEnvironment,
    userId: sanitizeOptionalString(value.userId, 120),
    buildVersion: sanitizeOptionalString(value.buildVersion, 120),
    metadata: sanitizeMetadata(value.metadata),
  };
}

function sanitizeErrorReport(value: unknown): ErrorReport | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 120);
  const type = sanitizeString(value.type, 32);
  const severity = sanitizeString(value.severity, 32);
  const message = sanitizeString(value.message, 1000);
  const fingerprint = sanitizeString(value.fingerprint, 160);
  const context = sanitizeContext(value.context);
  const stack = sanitizeOptionalString(value.stack, 4000);

  if (!id || !type || !severity || !message || !fingerprint || !context) {
    return null;
  }

  if (!MONITORING_ERROR_TYPES.includes(type as MonitoringErrorType)) {
    return null;
  }

  if (
    !MONITORING_ERROR_SEVERITIES.includes(
      severity as MonitoringErrorSeverity
    )
  ) {
    return null;
  }

  return {
    id,
    type: type as MonitoringErrorType,
    severity: severity as MonitoringErrorSeverity,
    message,
    stack,
    fingerprint,
    context,
    metadata: sanitizeMetadata(value.metadata),
  };
}

function sanitizePerformanceIssue(value: unknown): PerformanceIssue | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = sanitizeString(value.id, 120);
  const type = sanitizeString(value.type, 32);
  const metric = sanitizeString(value.metric, 120);
  const numericValue = sanitizeNumber(value.value);
  const threshold = sanitizeNumber(value.threshold);
  const context = sanitizeContext(value.context);

  if (!id || !type || !metric || numericValue === null || threshold === null || !context) {
    return null;
  }

  if (!PERFORMANCE_ISSUE_TYPES.includes(type as PerformanceIssueType)) {
    return null;
  }

  return {
    id,
    type: type as PerformanceIssueType,
    metric,
    value: numericValue,
    threshold,
    context,
  };
}

export function normalizeMonitoringPayload(
  value: unknown,
  options: NormalizeOptions = {}
): NormalizeResult {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: 'Invalid payload: JSON object required',
    };
  }

  if (!Array.isArray(value.errors)) {
    return {
      ok: false,
      error: 'Invalid payload: errors array required',
    };
  }

  if (
    value.performanceIssues !== undefined &&
    !Array.isArray(value.performanceIssues)
  ) {
    return {
      ok: false,
      error: 'Invalid payload: performanceIssues must be an array',
    };
  }

  const maxErrors = options.maxErrors ?? DEFAULT_MAX_ERRORS;
  const maxPerformanceIssues =
    options.maxPerformanceIssues ?? DEFAULT_MAX_PERFORMANCE_ISSUES;

  const errorCandidates = value.errors.slice(0, maxErrors);
  const performanceCandidates = (value.performanceIssues ?? []).slice(
    0,
    maxPerformanceIssues
  );

  const errors = errorCandidates
    .map((entry) => sanitizeErrorReport(entry))
    .filter((entry): entry is ErrorReport => entry !== null);

  const performanceIssues = performanceCandidates
    .map((entry) => sanitizePerformanceIssue(entry))
    .filter((entry): entry is PerformanceIssue => entry !== null);

  const rejectedErrors = value.errors.length - errors.length;
  const rejectedPerformanceIssues =
    (value.performanceIssues ?? []).length - performanceIssues.length;

  return {
    ok: true,
    value: {
      errors,
      performanceIssues,
      rejectedErrors,
      rejectedPerformanceIssues,
    },
  };
}
