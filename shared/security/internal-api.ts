import { NextResponse } from 'next/server';
import { getServerEnv, type ServerEnv } from '@/shared/env/server';

interface CookieStoreLike {
  get(name: string): { value: string } | undefined;
}

type RequestLike = Request & {
  cookies?: CookieStoreLike;
};

function getAuthorizationHeader(request: RequestLike): string | null {
  return request.headers.get('authorization');
}

function getBearerToken(request: RequestLike): string | null {
  const authorization = getAuthorizationHeader(request);
  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  return authorization.slice('bearer '.length).trim();
}

function getInternalHeaderToken(request: RequestLike): string | null {
  return request.headers.get('x-internal-api-key');
}

function getAdminSessionToken(request: RequestLike): string | null {
  if (!request.cookies) {
    return null;
  }

  return request.cookies.get('admin_session')?.value ?? null;
}

function getProvidedToken(request: RequestLike): string | null {
  return (
    getInternalHeaderToken(request) ??
    getBearerToken(request) ??
    getAdminSessionToken(request)
  );
}

export function hasInternalApiAccess(
  request: RequestLike,
  env: Partial<ServerEnv> = getServerEnv()
): boolean {
  const nodeEnv = env.NODE_ENV ?? 'development';
  const internalApiKey = env.INTERNAL_API_KEY;

  if (nodeEnv !== 'production' && !internalApiKey) {
    return true;
  }

  if (!internalApiKey) {
    return false;
  }

  return getProvidedToken(request) === internalApiKey;
}

export function requireInternalApiAccess(
  request: RequestLike,
  env: Partial<ServerEnv> = getServerEnv()
) {
  if (hasInternalApiAccess(request, env)) {
    return null;
  }

  return NextResponse.json(
    { error: 'Unauthorized' },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="Internal API"',
      },
    }
  );
}
