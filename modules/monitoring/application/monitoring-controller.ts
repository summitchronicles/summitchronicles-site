import {
  normalizeMonitoringPayload,
  type ErrorReport,
  type MonitoringErrorSeverity,
  type NormalizedMonitoringPayload,
  type PerformanceIssue,
} from '@/modules/monitoring/domain/monitoring';
import type { InMemoryWindowRateLimiter } from '@/modules/monitoring/infrastructure/in-memory-rate-limiter';

const DEFAULT_MAX_MONITORING_PAYLOAD_BYTES = 64 * 1024;

export interface MonitoringEnvelope {
  receivedAt: string;
  request: {
    origin: string | null;
    userAgent: string;
  };
  errors: ErrorReport[];
  performanceIssues: PerformanceIssue[];
  summary: {
    totalErrors: number;
    totalPerformanceIssues: number;
    rejectedErrors: number;
    rejectedPerformanceIssues: number;
    errorTypes: string[];
    severityDistribution: Partial<Record<MonitoringErrorSeverity, number>>;
  };
}

export interface MonitoringSink {
  send(payload: MonitoringEnvelope): Promise<void>;
}

export interface MonitoringIngestionRequest {
  ip: string;
  userAgent: string;
  contentType: string | null;
  contentLength: number | null;
  origin: string | null;
  allowedOrigins: string[];
  rateLimiter: InMemoryWindowRateLimiter;
  sinks?: MonitoringSink[];
  maxPayloadBytes?: number;
  now?: Date;
  isInternal?: boolean;
}

export interface MonitoringControllerResponse {
  status: number;
  body: Record<string, unknown>;
}

interface MonitoringHealthOptions {
  isInternal: boolean;
  now?: Date;
  nodeEnv?: string;
  buildVersion?: string;
  uptimeSeconds?: number;
  memoryUsage?: ReturnType<typeof process.memoryUsage> | Record<string, number>;
  rateLimitStoreSize?: number;
}

function createErrorResponse(
  status: number,
  error: string
): MonitoringControllerResponse {
  return {
    status,
    body: {
      success: false,
      error,
    },
  };
}

function isJsonContentType(contentType: string | null): boolean {
  return Boolean(contentType?.toLowerCase().includes('application/json'));
}

function isOriginAllowed(
  origin: string | null,
  allowedOrigins: string[],
  isInternal: boolean
): boolean {
  if (isInternal || !origin) {
    return true;
  }

  return allowedOrigins.includes(origin);
}

function createMonitoringEnvelope(
  normalized: NormalizedMonitoringPayload,
  request: MonitoringIngestionRequest
): MonitoringEnvelope {
  return {
    receivedAt: (request.now ?? new Date()).toISOString(),
    request: {
      origin: request.origin,
      userAgent: request.userAgent.slice(0, 512),
    },
    errors: normalized.errors,
    performanceIssues: normalized.performanceIssues,
    summary: {
      totalErrors: normalized.errors.length,
      totalPerformanceIssues: normalized.performanceIssues.length,
      rejectedErrors: normalized.rejectedErrors,
      rejectedPerformanceIssues: normalized.rejectedPerformanceIssues,
      errorTypes: Array.from(new Set(normalized.errors.map((error) => error.type))),
      severityDistribution: normalized.errors.reduce(
        (accumulator, error) => {
          accumulator[error.severity] =
            (accumulator[error.severity] ?? 0) + 1;
          return accumulator;
        },
        {} as Partial<Record<MonitoringErrorSeverity, number>>
      ),
    },
  };
}

export async function handleMonitoringIngestion(
  body: unknown,
  request: MonitoringIngestionRequest
): Promise<MonitoringControllerResponse> {
  if (!isJsonContentType(request.contentType)) {
    return createErrorResponse(415, 'Content-Type must be application/json');
  }

  if (
    request.contentLength !== null &&
    request.contentLength > (request.maxPayloadBytes ?? DEFAULT_MAX_MONITORING_PAYLOAD_BYTES)
  ) {
    return createErrorResponse(413, 'Monitoring payload too large');
  }

  if (!isOriginAllowed(request.origin, request.allowedOrigins, request.isInternal === true)) {
    return createErrorResponse(403, 'Origin not allowed');
  }

  const rateLimitResult = request.rateLimiter.consume(
    request.ip,
    (request.now ?? new Date()).getTime()
  );
  if (!rateLimitResult.allowed) {
    return createErrorResponse(429, 'Rate limit exceeded');
  }

  const normalized = normalizeMonitoringPayload(body);
  if (!normalized.ok) {
    return createErrorResponse(400, normalized.error);
  }

  if (
    normalized.value.errors.length === 0 &&
    normalized.value.performanceIssues.length === 0
  ) {
    return createErrorResponse(
      400,
      'No valid errors or performance issues provided'
    );
  }

  const envelope = createMonitoringEnvelope(normalized.value, request);

  if (request.sinks && request.sinks.length > 0) {
    await Promise.allSettled(
      request.sinks.map((sink) => sink.send(envelope))
    );
  }

  return {
    status: 200,
    body: {
      success: true,
      processed: {
        errors: envelope.summary.totalErrors,
        performanceIssues: envelope.summary.totalPerformanceIssues,
        rejectedErrors: envelope.summary.rejectedErrors,
        rejectedPerformanceIssues: envelope.summary.rejectedPerformanceIssues,
      },
    },
  };
}

export function createMonitoringHealthResponse(
  options: MonitoringHealthOptions
): MonitoringControllerResponse {
  const body: Record<string, unknown> = {
    status: 'healthy',
    timestamp: (options.now ?? new Date()).toISOString(),
    version: options.buildVersion ?? 'unknown',
    environment: options.nodeEnv ?? 'unknown',
  };

  if (options.isInternal) {
    body.uptime = options.uptimeSeconds ?? 0;
    body.memory = options.memoryUsage ?? {};
    body.rateLimitStore = {
      size: options.rateLimitStoreSize ?? 0,
      entries: options.rateLimitStoreSize ?? 0,
    };
  }

  return {
    status: 200,
    body,
  };
}
