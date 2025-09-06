"use client";

import { Suspense, lazy, useState, useEffect } from "react";
import { ContentSkeleton } from "@/app/components/ui";
import HeroFallback from "./HeroFallback";

// Lazy load the 3D hero component
const ImmersiveHero = lazy(() => import("./ImmersiveHero"));

interface EnhancedHeroProps {
  className?: string;
  force3D?: boolean;
}

export default function EnhancedHero({ 
  className = "",
  force3D = false 
}: EnhancedHeroProps) {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [has3DSupport, setHas3DSupport] = useState(false);

  // Check for WebGL support and device capability
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
      } catch (e) {
        return false;
      }
    };

    const checkDeviceCapability = () => {
      // Check if device is likely to handle 3D well
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isLowEnd = /android.*mobile/.test(userAgent) && window.screen.width < 768;
      
      // Check for sufficient memory if available
      const memory = (navigator as any).deviceMemory;
      const hasGoodMemory = !memory || memory >= 2;
      
      // Check network connection if available
      const connection = (navigator as any).connection;
      const hasGoodConnection = !connection || 
        connection.effectiveType === '4g' || 
        connection.effectiveType === '3g';
      
      return !isLowEnd && hasGoodMemory && hasGoodConnection;
    };

    const webGLSupported = checkWebGLSupport();
    const deviceCapable = checkDeviceCapability();
    
    setHas3DSupport(webGLSupported);
    setShouldLoad3D(force3D || (webGLSupported && deviceCapable));
  }, [force3D]);

  // Loading skeleton for 3D hero
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div className="space-y-8">
          {/* Badge skeleton */}
          <ContentSkeleton variant="button" width="200px" height="40px" />
          
          {/* Title skeleton */}
          <div className="space-y-4">
            <ContentSkeleton variant="custom" height="80px">
              <div className="h-20 w-full rounded-lg" />
            </ContentSkeleton>
            <ContentSkeleton variant="text" lines={2} />
          </div>
          
          {/* Buttons skeleton */}
          <div className="flex gap-4">
            <ContentSkeleton variant="button" width="200px" height="48px" />
            <ContentSkeleton variant="button" width="200px" height="48px" />
          </div>
        </div>
        
        {/* Dashboard skeleton */}
        <div>
          <ContentSkeleton variant="card" lines={4} height="400px" />
        </div>
      </div>
    </div>
  );

  // If device doesn't support 3D or we choose not to load it, use fallback
  if (!shouldLoad3D || !has3DSupport) {
    return <HeroFallback className={className} />;
  }

  // Load 3D hero with suspense
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ImmersiveHero className={className} />
    </Suspense>
  );
}