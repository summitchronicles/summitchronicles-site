import 'dotenv/config';

const SECRET = process.env.INGEST_SECRET;
if (!SECRET) {
  console.error('Missing INGEST_SECRET in .env.local');
  process.exit(1);
}

const body = JSON.stringify({
  title: process.argv[2] ?? 'expeditions',
  source: 'page:/expeditions',
  url: '/expeditions',
  access: 'public',
  text: process.argv[3] ?? 'The next expedition in the Summit Chronicles is Everest (target 2027).',
});

const res = await fetch('http://localhost:3000/api/db/ingest', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-ingest-secret': SECRET,
  },
  body,
});

const json = await res.json();
console.log(JSON.stringify(json, null, 2));