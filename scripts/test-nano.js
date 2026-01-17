
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testNanoBanana() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // List of candidate models to try
  const candidates = [
      'models/gemini-2.5-flash-image-preview', // Main Nano Banana
      'models/nano-banana-pro-preview',        // Pro variant
      'models/gemini-2.0-flash-exp-image-generation' // Fallback
  ];

  console.log('🍌 Testing Nano Banana Stability...\n');

  for (const modelName of candidates) {
      console.log(`Trying: ${modelName}...`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('A cyberpunk city skyline at night');
        const response = await result.response;

        console.log(`✅ SUCCESS with ${modelName}!`);
        // console.log(response.text()); // Might be binary/image
        break; // Stop after first success
      } catch (e) {
        console.log(`❌ Failed: ${e.message.split('\n')[0]}`); // Concise error
        if (e.message.includes('429')) {
             console.log('   -> Rate Limit Hit.');
        }
      }
      console.log('---');
  }
}

testNanoBanana();
