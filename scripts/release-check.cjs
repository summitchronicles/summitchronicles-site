#!/usr/bin/env node
// Simple preflight: env, index, cron, git status

const fs = require('fs');
const path = require('path');
const execSync = (cmd) => require('child_process').execSync(cmd, { stdio: 'inherit' });

const root = process.cwd();
const envPath = path.join(root, '.env.local');
const indexPath = path.join(root, 'data', 'rag-index.json');
const vercelJson = path.join(root, 'vercel.json');

// 1) Env check
if (!fs.existsSync(envPath)) {
  console.error('❌ Missing .env.local at project root.');
  process.exit(1);
}
const env = fs.readFileSync(envPath, 'utf8');
if (!/COHERE_API_KEY\s*=/.test(env)) {
  console.error('❌ .env.local is missing COHERE_API_KEY');
  process.exit(1);
}

// 2) RAG index check
if (!fs.existsSync(indexPath)) {
  console.error('❌ Missing data/rag-index.json. Run: npm run index:rag');
  process.exit(1);
}

// 3) Cron check (Hobby: max once/day)
if (fs.existsSync(vercelJson)) {
  try {
    const conf = JSON.parse(fs.readFileSync(vercelJson, 'utf8'));
    const crons = conf.crons || [];
    const bad = crons.find(c => typeof c.schedule === 'string' && /\/\d+/.test(c.schedule)); // e.g. */12
    if (bad) {
      console.error('❌ vercel.json "crons" uses more than once/day. Hobby only allows 1/day. Example: "0 4 * * *"');
      process.exit(1);
    }
  } catch (e) {
    console.warn('⚠️  Could not parse vercel.json. Skipping cron check.');
  }
}

// 4) Git clean check
try {
  execSync('git diff --quiet && git diff --cached --quiet');
} catch {
  console.error('❌ You have unstaged or uncommitted changes. Commit or stash before releasing.');
  process.exit(1);
}

console.log('✅ Preflight OK. Ready to release.');