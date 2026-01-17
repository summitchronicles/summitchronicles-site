
const apiKey = process.env.GOOGLE_API_KEY;
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
      console.error('No API Key found');
      return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

  try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('\n--- AVAILABLE MODELS ---');
      if (data.models) {
          data.models.forEach(m => {
              console.log(`\nName: ${m.name}`);
              console.log(`DisplayName: ${m.displayName}`);
              console.log(`Methods: ${m.supportedGenerationMethods?.join(', ')}`);
          });
      } else {
          console.log('No models found in response:', data);
      }
  } catch (e) {
      console.error('Fetch error:', e);
  }
}

listModels();
