
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// MANUAL ENV LOADING
const envPath = path.join(process.cwd(), '.env.local');
let GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const keyMatch = envContent.match(/GOOGLE_API_KEY=(.*)/);
    if (keyMatch) GOOGLE_API_KEY = keyMatch[1];
}

if (!GOOGLE_API_KEY) {
    console.error("Critical: Could not find GOOGLE_API_KEY");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const MODELS = [
    'models/gemini-2.0-flash-exp', // Last ditch attempt
    'models/gemini-1.5-pro-latest'
];

async function generateSingleImage() {
    const filename = process.argv[2];
    const prompt = process.argv.slice(3).join(' ');

    if (!filename || !prompt) {
        console.error("Usage: node generate-single-image.js <filename> <prompt>");
        process.exit(1);
    }

    console.log(`🖼️ Generating "${filename}"...`);
    console.log(`📝 Prompt: "${prompt}"`);

    for (const modelName of MODELS) {
        console.log(`\n🤖 Trying Model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;

            if (!response.candidates || !response.candidates[0].content.parts[0].inlineData) {
                console.log(`⚠️  No inline data for ${modelName}. Response might differ.`);
                continue;
            }

            const base64Data = response.candidates[0].content.parts[0].inlineData.data;
            const buffer = Buffer.from(base64Data, 'base64');
            const outPath = path.join(process.cwd(), 'public', 'images', filename);

            fs.writeFileSync(outPath, buffer);
            console.log(`✅ Success with ${modelName}! Image saved to: /images/${filename}`);
            process.exit(0);

        } catch (e) {
            console.error(`❌ Failed with ${modelName}: ${e.message.split('\n')[0]}`);
            if (e.message.includes('429')) console.log("   -> Rate Limit Quota Exceeded.");

            // Wait a bit before trying next model
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    console.error("\n❌ All models failed.");
    process.exit(1);
}

generateSingleImage();
