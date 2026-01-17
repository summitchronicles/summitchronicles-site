
require('dotenv').config({ path: '.env.local' });

async function testHFCorrect() {
    const key = process.env.HUGGINGFACE_API_KEY;
    const model = "stabilityai/stable-diffusion-xl-base-1.0";
    const url = `https://router.huggingface.co/hf-inference/models/${model}`;

    console.log(`Testing HF Router (${url})...`);

    try {
        const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${key}`,
                    "Content-Type": "application/json" // CRITICAL FIX
                },
                method: "POST",
                body: JSON.stringify({ inputs: "A magnificent mountain peak at sunrise" }),
        });

        if (!response.ok) {
            console.log(`Failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(text.substring(0, 500));
        } else {
const fs = require('fs');
            const path = require('path');

            console.log("✅ Success! Received Image Blob.");
            const buffer = await response.arrayBuffer();
            console.log(`Size: ${buffer.byteLength} bytes`);

            const artifactPath = '/Users/sunith/.gemini/antigravity/brain/d437ccb2-6ae4-490b-b0d5-b243bbd49a18/hf_sdxl_preview.png';
            fs.writeFileSync(artifactPath, Buffer.from(buffer));
            console.log(`Saved image to: ${artifactPath}`);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testHFCorrect();
