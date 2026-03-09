import {
  getKnowledgeBaseStats,
  initializeKnowledgeBase,
} from '@/lib/rag/training-knowledge-base';
import { ingestContentToKnowledgeBase } from '@/lib/rag/content-ingestion';
import { testConnection } from '@/lib/integrations/replicate';

export async function testAiConnection() {
  return testConnection();
}

export function getAiKnowledgeBaseStats() {
  return getKnowledgeBaseStats();
}

export async function initializeAiKnowledgeBase() {
  await initializeKnowledgeBase();
  return getKnowledgeBaseStats();
}

export async function ingestAiKnowledgeBaseContent() {
  return ingestContentToKnowledgeBase();
}
