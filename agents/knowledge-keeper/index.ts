import * as fs from 'fs';
import * as path from 'path';
import { generateEmbedding } from '../../lib/integrations/ollama';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const RESEARCH_FILE = path.join(process.cwd(), 'agents', 'researcher', 'latest_topics.json');
const STORE_FILE = path.join(process.cwd(), 'data', 'vector_store.json');

interface VectorDocument {
  id: string;
  text: string;
  source: string;
  embedding: number[];
  date: string;
}

export async function runKnowledgeKeeper() {
  console.log('🧠 Starting Knowledge Keeper Agent...');

  // Load existing store
  let vectorStore: VectorDocument[] = [];
  if (fs.existsSync(STORE_FILE)) {
    vectorStore = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
    console.log(`Loaded ${vectorStore.length} documents from store.`);
  } else {
    // Ensure data dir
    if (!fs.existsSync(path.dirname(STORE_FILE))) fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  }

  // 1. Scan Blogs
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
    for (const file of files) {
      if (vectorStore.some(d => d.source === file)) continue; // Skip if already indexed

      console.log(`Indexing blog: ${file}`);
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');

      try {
        const embedding = await generateEmbedding(content);
        vectorStore.push({
          id: file,
          text: content,
          source: file,
          embedding,
          date: new Date().toISOString()
        });
      } catch (e) {
        console.warn(`Failed to embed ${file} (Ollama model might be missing). Skipping.`);
      }
    }
  }

  // 2. Scan Research
  if (fs.existsSync(RESEARCH_FILE)) {
     const topics = JSON.parse(fs.readFileSync(RESEARCH_FILE, 'utf-8'));
     for (const t of topics) {
       const id = `research-${t.topic.replace(/\s+/g, '-')}`;
       if (vectorStore.some(d => d.id === id)) continue;

       console.log(`Indexing research: ${t.topic}`);
       try {
        const embedding = await generateEmbedding(t.description);
        vectorStore.push({
            id,
            text: `${t.topic}: ${t.description}`,
            source: 'research-agent',
            embedding,
            date: new Date().toISOString()
        });
       } catch (e) {
           // Silent fail
       }
     }
  }

  // 3. Save Store
  fs.writeFileSync(STORE_FILE, JSON.stringify(vectorStore, null, 2));
  console.log(`✅ Knowledge Keeper finished. Total documents: ${vectorStore.length}`);
}

// Allow running directly
if (require.main === module) {
    runKnowledgeKeeper();
}
