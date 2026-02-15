
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const { data, content, stringify } = require('gray-matter');

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
const MODEL_NAME = 'models/gemini-2.5-flash-image'; // Nano Banana (Corrected)

async function generateNanoImage(prompt) {
    console.log(`🍌 Generating with Nano Banana (${MODEL_NAME}): "${prompt}"...`);

    // RETRY LOGIC for 429s
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            const result = await model.generateContent(prompt);
            const response = await result.response;

            if (!response.candidates || !response.candidates[0].content.parts[0].inlineData) {
                console.log("No inline image data found. Response:", JSON.stringify(response, null, 2));
                throw new Error("No image data returned");
            }

            const base64Data = response.candidates[0].content.parts[0].inlineData.data;
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `nano-${Date.now()}.png`;
            const outPath = path.join(process.cwd(), 'public', 'images', filename);

            fs.writeFileSync(outPath, buffer);
            console.log(`✅ Saved: ${filename}`);
            return `/images/${filename}`;

        } catch (e) {
            console.error(`❌ Attempt ${attempt} Failed: ${e.message.split('\n')[0]}`);
            const isRateLimit = e.message.includes('429');
            const isServerErr = e.message.includes('503');

            if (isRateLimit || isServerErr) {
                const waitTime = attempt * 10000; // 10s, 20s, 30s
                console.log(`⏳ Rate Limit/Server Error. Waiting ${waitTime/1000}s...`);
                await new Promise(r => setTimeout(r, waitTime));
                continue;
            }
            if (e.message.includes('404')) break; // Don't retry invalid model
        }
    }

    return `https://placehold.co/800x600?text=Nano+Gen+Failed`;
}

async function processBlog() {
    const blogPath = path.join(process.cwd(), 'content', 'blog', '2026-01-27-the-impact-of-microplastics-on-high-altitude-environments.md');
    if (!fs.existsSync(blogPath)) {
        console.error("Blog file not found!");
        process.exit(1);
    }

    const fileContent = fs.readFileSync(blogPath, 'utf8');
    const parsed = require('gray-matter')(fileContent);
    let newContent = parsed.content;

    // 1. Generate Hero Image
    if (!parsed.data.image || parsed.data.image.includes('placehold') || parsed.data.image.includes('hero-')) {
         const heroPrompt = "cinematic macro shot of microplastic fragments embedded in clear blue glacial ice, high altitude himalayan mountain background blurred, contrast between nature and pollution, highly detailed, 8k, photorealistic";
         const heroUrl = await generateNanoImage(heroPrompt);
         parsed.data.image = heroUrl;
    }

    // 2. Process Inline Images
    const imageRegex = /\[IMAGE: (.*?)\]/g;
    let match;
    const matches = [];
    while ((match = imageRegex.exec(newContent)) !== null) {
        matches.push({ full: match[0], desc: match[1] });
    }

    for (const m of matches) {
        const prompt = `cinematic photo, ${m.desc}, high altitude mountaineering context, 8k, photorealistic, national geographic style`;
        const url = await generateNanoImage(prompt);
        // Replace globally just in case
        newContent = newContent.replace(m.full, `![${m.desc}](${url})`);
    }

    const newFile = stringify(newContent, parsed.data);
    fs.writeFileSync(blogPath, newFile);
    console.log("Blog Updated with Nano Banana Images!");
}

processBlog();
