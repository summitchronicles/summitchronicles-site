import dotenv from 'dotenv';
import {
  generateChatCompletion,
  generateEmbedding,
} from '../lib/integrations/replicate';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testReplicate() {
  console.log('🚀 Testing Replicate Embeddings ONLY (BGE-Large)...\n');

  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ Error: REPLICATE_API_TOKEN not found in .env.local');
    process.exit(1);
  }

  try {
    // 3. Test Embeddings
    console.log('Testing Embeddings (BGE-Large)...');
    const embedStart = Date.now();
    const embedding = await generateEmbedding(
      'Mount Everest is the highest peak.'
    );
    const embedDuration = Date.now() - embedStart;

    if (Array.isArray(embedding) && embedding.length === 1024) {
      console.log(`✅ Embedding generated successfully!`);
      console.log(`Dimensions: ${embedding.length} (BGE-Large Standard)`);
      console.log(`Time: ${embedDuration}ms`);
      console.log(
        `First 5 values: [${embedding
          .slice(0, 5)
          .map((n) => n.toFixed(4))
          .join(', ')}...]`
      );
      console.log('\n🎉 EMBEDDINGS OPERATIONAL!');
    } else {
      console.error(
        `❌ Embedding dimension mismatch. Expected 1024, got ${embedding.length}`
      );
    }
  } catch (error: any) {
    if (
      error.message.includes('402') ||
      error.message.includes('Insufficient credit')
    ) {
      console.error(
        '\n💰 PAYMENT REQUIRED: You need to add credits to your Replicate account.'
      );
      console.error('Visit: https://replicate.com/account/billing');
    } else {
      console.error('\n❌ Test Failed:', error.message);
    }
  }
}

testReplicate();
