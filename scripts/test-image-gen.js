
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testImageGen() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Trying the proper Gemini 2.0 Flash Image model
  const modelName = 'models/gemini-2.0-flash-exp-image-generation';

  console.log(`Testing Image Gen with: ${modelName}`);

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('A futuristic mountain climber on Mars');
    const response = await result.response;

    console.log('Success!');
    console.log('Response text:', response.text());
    // In real usage we'd access valid image data here if sdk supports it,
    // or inspect the response structure.
    console.log('Candidates:', JSON.stringify(response.candidates, null, 2));
  } catch (e) {
    console.error('Generation Failed:', e);
  }
}

testImageGen();
