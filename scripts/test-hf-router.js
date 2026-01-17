
require('dotenv').config({ path: '.env.local' });

async function testHFRouter() {
    const key = process.env.HUGGINGFACE_API_KEY;
    const model = "stabilityai/stable-diffusion-xl-base-1.0";
    // Constructing URL based on the error message hint
    // Often it's just replacing the domain
    const url = `https://router.huggingface.co/models/${model}`; // Guessing the path
    // Or maybe it is https://router.huggingface.co/hf-inference/models/...

    console.log(`Testing Hugging Face Router (${url})...`);

    try {
        const response = await fetch(url, {
                headers: { Authorization: `Bearer ${key}` },
                method: "POST",
                body: JSON.stringify({ inputs: "A magnificent mountain peak at sunrise" }),
        });

        if (!response.ok) {
            console.log(`Failed: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(text.substring(0, 500)); // Log first 500 chars
        } else {
            console.log("✅ Success! Received Image Blob.");
            const buffer = await response.arrayBuffer();
            console.log(`Size: ${buffer.byteLength} bytes`);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testHFRouter();
