import { getAvailableModels } from '../lib/integrations/ollama';

async function main() {
  console.log('Checking available Ollama models...');
  const models = await getAvailableModels();
  console.log('Available models:', models);
}

main().catch(console.error);
