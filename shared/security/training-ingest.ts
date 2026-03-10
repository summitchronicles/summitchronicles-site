import { NextResponse } from 'next/server';
import { getServerEnv, type ServerEnv } from '@/shared/env/server';
import { hasInternalApiAccess } from '@/shared/security/internal-api';

type RequestLike = Request & {
  cookies?: {
    get(name: string): { value: string } | undefined;
  };
};

function getTrainingIngestSecret(request: RequestLike): string | null {
  const secret = request.headers.get('x-training-ingest-secret');
  return secret?.trim() || null;
}

export function hasTrainingIngestAccess(
  request: RequestLike,
  env: Partial<ServerEnv> = getServerEnv()
): boolean {
  if (hasInternalApiAccess(request, env)) {
    return true;
  }

  const ingestSecret = env.TRAINING_INGEST_SECRET;

  if (!ingestSecret) {
    return false;
  }

  return getTrainingIngestSecret(request) === ingestSecret;
}

export function requireTrainingIngestAccess(
  request: RequestLike,
  env: Partial<ServerEnv> = getServerEnv()
) {
  if (hasTrainingIngestAccess(request, env)) {
    return null;
  }

  return NextResponse.json(
    { error: 'Unauthorized' },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="Training Ingest"',
      },
    }
  );
}
