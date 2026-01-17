
const fs = require('fs');
const path = require('path');
const { data, content, stringify } = require('gray-matter');

// MANUAL ENV LOADING
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/HUGGINGFACE_API_KEY=(hf_.*)/);
const HF_API_KEY = keyMatch ? keyMatch[1] : null;

if (!HF_API_KEY) {
    console.error("Critical: Could not find HUGGINGFACE_API_KEY in .env.local");
    process.exit(1);
}

// LOAD VISUAL KNOWLEDGE
function loadVisualKnowledge() {
    try {
        const knowledgePath = path.join(process.cwd(), 'agents', 'researcher', 'visual_knowledge.md');
        if (fs.existsSync(knowledgePath)) {
            return fs.readFileSync(knowledgePath, 'utf8');
        }
    } catch(e) { console.warn("Could not load visual knowledge"); }
    return "";
}

const VISUAL_KNOWLEDGE = loadVisualKnowledge();

// DUPLICATED LOGIC FROM AGENT (To ensure consistency)
function getEnrichedPrompt(baseDescription) {
    const sections = VISUAL_KNOWLEDGE.split('## ');
    let additionalDetails = "";

    for (const section of sections) {
        if (!section.trim()) continue;
        const lines = section.split('\n');
        const title = lines[0].toLowerCase();

        const keywordLine = lines.find(l => l.startsWith('**Keywords:**'));
        const keywords = keywordLine ? keywordLine.replace('**Keywords:**', '').split(',').map(s => s.trim().toLowerCase()) : [title];

        // Check if description matches keywords
        const matches = keywords.some(k => baseDescription.toLowerCase().includes(k));

        if (matches) {
            const modifierLine = lines.find(l => l.startsWith('**Prompt Modifiers:**'));
            if (modifierLine) {
                additionalDetails += " " + modifierLine.replace('**Prompt Modifiers:**', '').trim();
            }
        }
    }

    if (additionalDetails) {
        console.log(`✨ Enriched: "${baseDescription}" + "${additionalDetails.substring(0,30)}..."`);
        return `cinematic photo, ${baseDescription}, ${additionalDetails}, 8k, photorealistic, national geographic style`;
    }

    return `cinematic photo, detailed faces, 8k, photorealistic, ${baseDescription}, national geographic style, dramatic lighting`;
}

// Simple fetch wrapper for Hugging Face
async function generateImage(prompt) {
    const model = 'stabilityai/stable-diffusion-xl-base-1.0';
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    console.log(`Generating: ${prompt}`);

    // Retry logic
    for(let i=0; i<3; i++) {
        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${HF_API_KEY}`, 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({ inputs: prompt, parameters: { negative_prompt: "blurry, carton, illustration, painting, drawing, bad anatomy, deformed" } })
            });

            if (response.status === 503) {
                 console.log("Model loading... waiting...");
                 await new Promise(r => setTimeout(r, 5000));
                 continue;
            }

            if (!response.ok) throw new Error(`Failed: ${response.status}`);

            const buffer = await response.arrayBuffer();
            const filename = `hero-${Date.now()}.png`;
            const outPath = path.join(process.cwd(), 'public', 'images', filename);

            fs.writeFileSync(outPath, Buffer.from(buffer));
            return `/images/${filename}`;
        } catch (e) {
            console.warn(`Attempt ${i+1} failed: ${e.message}`);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    throw new Error("Failed to generate image after retries");
}

async function fixBlog() {
    const blogPath = path.join(process.cwd(), 'content', 'blog', '2026-01-15-uncovering-the-mystique-of-sherpa-buddhism.md');
    if (!fs.existsSync(blogPath)) {
        console.error("Blog file not found: " + blogPath);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(blogPath, 'utf8');
    const parsed = require('gray-matter')(fileContent);
    let newContent = parsed.content;

    // 1. HERO - Enriched
    // We use keywords that exist in Visual Knowledge to trigger enrichment
    const heroBase = "wide shot of sherpa village in himalayas with stupa";
    const heroPrompt = getEnrichedPrompt(heroBase); // Should trigger 'Sherpa', 'Stupa', 'Himalayas'
    const heroUrl = await generateImage(heroPrompt);
    console.log("New Hero: " + heroUrl);
    parsed.data.image = heroUrl;

    // 2. REPLACE IMAGES using Enriched Prompts

    // A. Yak Family -> "Sherpa herders"
    const yakBase = "Sherpa herders with yaks in himalayas";
    const yakPrompt = getEnrichedPrompt(yakBase); // Should trigger 'Sherpa', 'Himalayas'
    const yakUrl = await generateImage(yakPrompt);
    newContent = newContent.replace(/!\[.*?Sherpa family.*?\]\(.*?\)/i, `![Sherpa family with yaks](${yakUrl})`);

    // B. Mani Stones -> "Mani stone"
    const maniBase = "close up of mani stone";
    const maniPrompt = getEnrichedPrompt(maniBase); // Should trigger 'Mani Stones'
    const maniUrl = await generateImage(maniPrompt);
    newContent = newContent.replace(/!\[.*?Mani Stones.*?\]\(.*?\)/i, `![Mani Stones](${maniUrl})`);

    // C. Climber -> "Sunith Climber" (Triggers author profile if keywords match)
    // We use "Sunith" keyword to trigger the specific author description
    const climberBase = "Sunith climber standing on summit of mount everest";
    const climberPrompt = getEnrichedPrompt(climberBase); // Should trigger 'Sunith'
    const climberUrl = await generateImage(climberPrompt);
    newContent = newContent.replace(/!\[.*?Climber.*?\]\(.*?\)/i, `![Sunith on Summit](${climberUrl})`);

    const newFile = require('gray-matter').stringify(newContent, parsed.data);
    fs.writeFileSync(blogPath, newFile);
    console.log("Blog Updated via Visual Knowledge System!");
}

fixBlog();
