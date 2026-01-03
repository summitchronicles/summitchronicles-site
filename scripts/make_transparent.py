from PIL import Image
import os

def remove_black_background(input_path, output_path):
    print(f"Processing: {input_path}")

    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (r, g, b, a)
            # If the pixel is very dark (black background), make it transparent
            # We use a threshold of 30 for RGB values to catch compressed blacks
            if item[0] < 30 and item[1] < 30 and item[2] < 30:
                newData.append((255, 255, 255, 0))  # Fully transparent
            else:
                # Keep the pixel, but force it to be white for the icon content
                # This ensures the logo is pure white on transparent
                # or we can keep original color. Let's keep original for now but maybe boost white.
                # Actually, standard approach: If it's not background, keep it.
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved transparent logo to: {output_path}")

    except Exception as e:
        print(f"Error processing image: {e}")

# Paths
input_file = "public/images/logo-v2.png"
output_file = "public/images/logo-transparent.png"

remove_black_background(input_file, output_file)
