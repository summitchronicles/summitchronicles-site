"use client";

import { motion } from "framer-motion";
import { 
  WifiIcon,
  ArrowPathIcon,
  MapIcon
} from "@heroicons/react/24/outline";

export default function OfflinePage() {
  const handleRetry = () => {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return (registration as any).sync.register('retry-connection');
      });
    }
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto w-24 h-24"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-alpineBlue/20 to-glacierBlue/20 rounded-full" />
            <div className="absolute inset-2 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center">
              <MapIcon className="w-8 h-8 text-alpineBlue" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-transparent border-t-summitGold rounded-full"
            />
          </motion.div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">You&apos;re Offline</h1>
            <p className="text-white/60 leading-relaxed">
              It looks like you&apos;ve lost your internet connection. Don&apos;t worry - some content 
              is still available from your last visit.
            </p>
          </div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-white/50 text-sm"
          >
            <WifiIcon className="w-4 h-4" />
            <span>Connection unavailable</span>
          </motion.div>

          {/* Actions */}
          <div className="space-y-4">
            <motion.button
              onClick={handleRetry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-summitGold text-black font-semibold rounded-2xl hover:bg-yellow-400 transition-colors duration-300"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Try Again
            </motion.button>

            {/* Available offline content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
            >
              <h3 className="text-white font-medium mb-2">Available Offline</h3>
              <div className="text-sm text-white/60 space-y-1">
                <div>• Recent training data</div>
                <div>• Previously viewed expeditions</div>
                <div>• Cached gear reviews</div>
                <div>• Your conversation history</div>
              </div>
            </motion.div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-white/40 space-y-2"
          >
            <p>💡 Tip: This page works offline thanks to smart caching</p>
            <p>🏔️ Your Seven Summits journey continues, connection or not</p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}