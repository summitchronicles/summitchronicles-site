const sharp = require('sharp');
const path = require('path');

const inputFile = path.join(process.cwd(), 'public/images/logo-v2.png');
const outputFile = path.join(process.cwd(), 'public/images/logo-transparent.png');

async function processImage() {
  try {
    console.log(`Processing: ${inputFile}`);

    // 1. Get raw pixel data
    const { data, info } = await sharp(inputFile)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 2. Modify pixels (R, G, B, A)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Threshold for "Black"
      // If pixel is very dark (background), make it transparent
      if (r < 40 && g < 40 && b < 40) {
        data[i + 3] = 0; // Alpha = 0 (Transparent)
      } else {
        // Optional: Boost white content to be pure white
        // This ensures no gray artifacts from anti-aliasing against black remain
         const brightness = (r + g + b) / 3;
         if (brightness > 50) {
             data[i] = 255;
             data[i+1] = 255;
             data[i+2] = 255;
             data[i+3] = 255; // Fully opaque
         }
      }
    }

    // 3. Save back to PNG
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputFile);

    console.log(`Success! Saved to ${outputFile}`);
  } catch (error) {
    console.error('Error processing image:', error);
    process.exit(1);
  }
}

processImage();
