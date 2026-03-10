interface Env {
  TRAINING_INGEST_URL: string;
  TRAINING_INGEST_SECRET: string;
}

function getHeaders(env: Env): HeadersInit {
  return {
    'content-type': 'application/json',
    'x-training-ingest-secret': env.TRAINING_INGEST_SECRET,
    'user-agent': 'summit-chronicles-training-ingest-worker/1.0',
  };
}

async function triggerIngest(env: Env): Promise<Response> {
  return fetch(env.TRAINING_INGEST_URL, {
    method: 'POST',
    headers: getHeaders(env),
  });
}

export default {
  async scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ) {
    ctx.waitUntil(
      triggerIngest(env).then(async (response) => {
        if (!response.ok) {
          const body = await response.text();
          console.error(
            `Training ingest failed with ${response.status}: ${body}`
          );
        }
      })
    );
  },

  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ ok: true });
    }

    if (url.pathname === '/trigger' && request.method === 'POST') {
      const response = await triggerIngest(env);
      const body = await response.text();

      return new Response(body, {
        status: response.status,
        headers: {
          'content-type':
            response.headers.get('content-type') ?? 'application/json',
        },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};
