import 'dotenv/config';

const SECRET = process.env.INGEST_SECRET;
const ENDPOINT =
  process.env.INGEST_ENDPOINT?.trim() || 'http://localhost:3000/api/db/ingest';

if (!SECRET) {
  console.error('❌ Missing INGEST_SECRET in environment (e.g. in .env.local).');
  process.exit(1);
}

const title = process.argv[2] ?? 'expeditions';
const text =
  process.argv[3] ??
  'The next expedition in the Summit Chronicles is Everest (target 2027).';

const payload = {
  title,
  source: 'page:/expeditions', // keep the leading ":" to match your schema
  url: '/expeditions',
  access: 'public',
  text, // single string; server will embed this
};

console.log('→ Ingesting with:');
console.log('  ENDPOINT        :', ENDPOINT);
console.log('  title           :', payload.title);
console.log('  source          :', payload.source);
console.log('  url             :', payload.url);
console.log('  access          :', payload.access);
console.log('  text (preview)  :', payload.text.slice(0, 80) + (payload.text.length > 80 ? '…' : ''));

let res;
try {
  res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-ingest-secret': SECRET,
    },
    redirect: 'follow',
    body: JSON.stringify(payload),
  });
} catch (e) {
  console.error('❌ Network error calling ingest endpoint:', e.message);
  process.exit(1);
}

// Some hosts return HTML bodies on error; try JSON first then fall back to text
const ct = res.headers.get('content-type') || '';
let body;
if (ct.includes('application/json')) {
  try {
    body = await res.json();
  } catch {
    body = { ok: false, error: 'Invalid JSON from server' };
  }
} else {
  const textBody = await res.text();
  body = { ok: false, status: res.status, body: textBody.slice(0, 400) };
}

if (!res.ok || body?.ok === false) {
  console.error('❌ Ingest failed');
  console.error('  HTTP:', res.status, res.statusText);
  console.error('  Body:', typeof body === 'string' ? body : JSON.stringify(body, null, 2));
  process.exit(1);
}

console.log('✅ Ingest OK');
console.log(JSON.stringify(body, null, 2));