
require('dotenv').config({ path: '.env.local' });

async function testHF() {
    const key = process.env.HUGGINGFACE_API_KEY;
    const model = "stabilityai/stable-diffusion-xl-base-1.0";

    console.log(`Testing Hugging Face (${model})...`);

    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                headers: { Authorization: `Bearer ${key}` },
                method: "POST",
                body: JSON.stringify({ inputs: "A magnificent mountain peak at sunrise, photorealistic, 8k" }),
            }
        );

        if (!response.ok) {
            console.log(`Failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(text);
        } else {
            console.log("✅ Success! Received Image Blob.");
            const buffer = await response.arrayBuffer();
            console.log(`Size: ${buffer.byteLength} bytes`);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testHF();
