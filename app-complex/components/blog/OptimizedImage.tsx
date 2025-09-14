'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width = 800, 
  height = 400, 
  className = "rounded-xl shadow-2xl" 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/10 animate-pulse flex items-center justify-center">
          <div className="text-white/60">Loading image...</div>
        </div>
      )}
      
      {error ? (
        <div className="w-full h-48 bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
          <div className="text-center text-white/60">
            <div className="text-sm">Image failed to load</div>
            <div className="text-xs mt-1">{alt}</div>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          priority={false}
        />
      )}
    </div>
  );
}