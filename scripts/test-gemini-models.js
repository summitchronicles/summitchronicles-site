require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('No GOOGLE_API_KEY found in .env.local');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // There isn't a direct "listModels" on the client instance in some versions,
    // but we can try to run a basic prompt on a few common names to see which works.

    const modelsToCheck = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.0-pro',
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-001'
  ];
    console.log('Testing models...');

    for (const modelName of modelsToCheck) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const m = genAI.getGenerativeModel({ model: modelName });
            const result = await m.generateContent('Hello');
            const response = await result.response;
            console.log('✅ Success!');
        } catch (e) {
            console.log(`❌ Failed: ${e.message.split(']')[0]}]`); // Short error
        }
    }

  } catch (e) {
    console.error('Error:', e);
  }
}

listModels();
