
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function testWorkingModel() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  // Using the exact name found in the earlier list
  const modelName = 'models/gemini-1.5-flash-latest';

  console.log(`Testing Model: ${modelName}...\n`);

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Hello!');
    const response = await result.response;

    console.log(`✅ SUCCESS! ${modelName} is working.`);
    console.log(`Response: ${response.text()}`);
  } catch (e) {
    console.log(`❌ FAILED: ${e.message}`);
  }
}

testWorkingModel();
