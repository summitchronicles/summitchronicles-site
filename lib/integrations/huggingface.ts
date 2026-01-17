import fs from 'fs';
import path from 'path';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MAX_RETRIES = 3;

/**
 * Generate an image using Hugging Face (SDXL via Router)
 * Saves the image locally to public/images and returns a Markdown image string.
 */
export async function generateHuggingFaceImage(
  prompt: string
): Promise<string | null> {
  if (!HF_API_KEY) {
    console.error('❌ HUGGINGFACE_API_KEY is missing.');
    return null;
  }

  const model = 'stabilityai/stable-diffusion-xl-base-1.0';
  const url = `https://router.huggingface.co/hf-inference/models/${model}`;

  console.log(`🎨 Generating Image via Hugging Face (${model})...`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const text = await response.text();
        // 503 means loading, retry
        if (response.status === 503) {
          console.warn(
            `⏳ Model loading (503). Retrying in ${attempt * 2}s...`
          );
          await new Promise((r) => setTimeout(r, attempt * 2000));
          continue;
        }
        console.error(
          `❌ HF Error (${response.status}): ${text.substring(0, 200)}`
        );
        return null;
      }

      const buffer = await response.arrayBuffer();

      // Save to public/images
      const filename = `generated-${Date.now()}.png`;
      const publicDir = path.join(process.cwd(), 'public', 'images');

      // Ensure dir exists
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const filepath = path.join(publicDir, filename);
      fs.writeFileSync(filepath, Buffer.from(buffer));

      console.log(`✅ Image Saved: /images/${filename}`);
      return `![${prompt}](/images/${filename})`;
    } catch (e: any) {
      console.error(`❌ HF Exception: ${e.message}`);
      return null;
    }
  }

  return null;
}
