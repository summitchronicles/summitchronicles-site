import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { getOrientation } from 'get-orientation/browser';
import getCroppedImg from './canvasUtils';
import { rotateSize } from './canvasUtils'; // Optional if needed locally

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
  onSkip: () => void;
}

const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
  onSkip,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Define aspect ratio for Hero Image (e.g., 16:9 roughly, or free form?)
  // User asked for "landscape" coverage. 21:9 is cinematic, 16:9 is standard.
  // Let's use 16:9 as a safe default for landscape.
  const ASPECT_RATIO = 16 / 9;

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedImage) {
          onCropComplete(croppedImage);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  console.log(
    'ImageCropper rendered with imageSrc:',
    imageSrc.substring(0, 50) + '...'
  );

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[60vh] bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={ASPECT_RATIO}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
        />
      </div>

      <div className="w-full max-w-md mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Zoom</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-summit-gold"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
          >
            Skip Crop (Upload Original)
          </button>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-summit-gold text-black font-bold rounded hover:bg-yellow-400 transition-colors"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
