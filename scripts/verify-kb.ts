import dotenv from 'dotenv';
import {
  initializeKnowledgeBase,
  getKnowledgeBaseStats,
} from '../lib/rag/training-knowledge-base';
import fs from 'fs';
import path from 'path';

// Load env
dotenv.config({ path: '.env.local' });

async function verify() {
  console.log('🔍 Verifying Knowledge Base Initialization...');
  const start = Date.now();

  await initializeKnowledgeBase();

  const duration = Date.now() - start;
  const stats = getKnowledgeBaseStats();

  console.log(`\n✅ Initialization Complete in ${duration}ms`);
  console.log(`📚 Documents: ${stats.totalDocuments}`);
  console.log(`📂 Categories: ${Object.keys(stats.categories).length}`);

  const cachePath = path.join(
    process.cwd(),
    'generated',
    'embeddings-cache.json'
  );
  if (fs.existsSync(cachePath)) {
    const cacheSize = (fs.statSync(cachePath).size / 1024).toFixed(2);
    console.log(`💾 Cache File Exists: ${cachePath} (${cacheSize} KB)`);
  } else {
    console.log(
      '⚠️ Cache file NOT found (First run might have failed to save?)'
    );
  }
}

verify().catch(console.error);
