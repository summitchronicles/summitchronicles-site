
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testDalle() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('Testing DALL-E 3 Generation...');

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A minimalist line drawing of a mountaineer standing on a peak",
      n: 1,
      size: "1024x1024",
    });

    console.log('Success!');
    console.log('Image URL:', response.data[0].url);
  } catch (e) {
    console.error('DALL-E Failed:', e.message);
    if (e.code === 'insufficient_quota') {
        console.error('CAUSE: No credits on OpenAI account.');
    }
  }
}

testDalle();
