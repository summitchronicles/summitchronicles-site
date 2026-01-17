
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function findWorkingModel() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

  const candidates = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-001',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-1.0-pro',
      'gemini-pro',
      'gemini-2.0-flash-exp' // Text-only
  ];

  console.log('🕵️‍♂️ Searching for a working model...\n');

  for (const name of candidates) {
       process.stdout.write(`Testing ${name}... `);
       try {
           const model = genAI.getGenerativeModel({ model: name });
           const result = await model.generateContent('Hi');
           const response = await result.response;
           console.log(`✅ SUCCESS!`);
           console.log(`   -> This model works! Use this one.`);
           return;
       } catch (e) {
           if (e.message.includes('429')) console.log(`❌ Quota Limit (429)`);
           else if (e.message.includes('404')) console.log(`❌ Not Found (404)`);
           else console.log(`❌ Error: ${e.message.split('\n')[0]}`);
       }
  }

  console.log('\n❌ ALL MODELS FAILED. Your API Key or Project is likely disabled/suspended.');
}

findWorkingModel();
