'use client';

import { motion } from 'framer-motion';
import { Camera, ExternalLink } from 'lucide-react';

interface PhotoShowcaseProps {
  title: string;
  photos: Array<{
    id: string;
    src: string;
    alt: string;
    caption?: string;
    location?: string;
    date?: string;
    achievement?: string;
    placeholder?: boolean; // For showing placeholder until real photos are added
  }>;
  className?: string;
  layout?: 'grid' | 'masonry' | 'slider';
}

export function PhotoShowcase({
  title,
  photos,
  className = '',
  layout = 'grid',
}: PhotoShowcaseProps) {
  if (photos.length === 0) {
    return (
      <div
        className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-spa-stone/10 ${className}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-spa-stone/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-spa-charcoal/40" />
          </div>
          <h3 className="text-xl font-medium text-spa-charcoal mb-2">
            {title}
          </h3>
          <p className="text-spa-charcoal/60 text-sm">
            Photo gallery coming soon. Real summit and training photos will be
            added here.
          </p>
        </div>
      </div>
    );
  }

  const gridClass =
    layout === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      : layout === 'masonry'
        ? 'columns-1 md:columns-2 lg:columns-3 gap-6'
        : 'flex space-x-4 overflow-x-auto max-w-full';

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-medium text-spa-charcoal mb-2">{title}</h3>
        <div className="w-20 h-1 bg-summit-gold rounded-full mx-auto"></div>
      </div>

      <div className={layout === 'slider' ? 'overflow-hidden' : ''}>
        <div className={gridClass}>
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-spa-stone/10 shadow-sm hover:shadow-lg transition-all duration-300">
                {photo.placeholder ? (
                  // Placeholder for when real photos aren't available yet
                  <div
                    className="aspect-[4/3] bg-gradient-to-br from-spa-mist to-spa-cloud flex items-center justify-center"
                    role="img"
                    aria-label={`Placeholder for ${photo.achievement || 'Summit Photo'}`}
                  >
                    <div className="text-center">
                      <Camera
                        className="w-12 h-12 text-spa-charcoal/30 mx-auto mb-2"
                        aria-hidden="true"
                      />
                      <div className="text-sm text-spa-charcoal/60">
                        {photo.achievement || 'Summit Photo'}
                      </div>
                      <div className="text-xs text-spa-charcoal/40 mt-1">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo.src})` }}
                    role="img"
                    aria-label={photo.alt}
                  >
                    <div className="w-full h-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <ExternalLink
                          className="w-4 h-4"
                          aria-label="View full size image"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {photo.caption && (
                  <div className="p-4">
                    <p className="text-sm font-medium text-spa-charcoal mb-1">
                      {photo.caption}
                    </p>
                    {photo.location && (
                      <p className="text-xs text-spa-charcoal/60">
                        {photo.location}
                      </p>
                    )}
                    {photo.date && (
                      <p className="text-xs text-spa-charcoal/60">
                        {photo.date}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {photos.some((p) => p.placeholder) && (
        <div className="text-center">
          <div className="bg-summit-gold/10 border border-summit-gold/20 rounded-lg p-4">
            <p className="text-sm text-spa-charcoal/80">
              📸 <strong>Photo Integration Ready:</strong> This component is
              prepared for your summit and training photos. Simply replace the
              placeholder images with your actual expedition documentation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
