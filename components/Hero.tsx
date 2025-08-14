'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    // Taller, cinematic hero
    <section className="relative isolate overflow-hidden min-h-[70svh] md:min-h-[85svh]">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero.jpg"
          alt="Lone mountaineer walking across a snowy ridge with Himalayan peaks behind"
          fill
          priority
          // show more sky/peaks (top-center) and avoid ground cropping
          className="object-cover object-[50%_22%]"
          sizes="100vw"
        />
      </div>

      {/* Readability overlay */}
      <div className="hero-gradient absolute inset-0 -z-10" />

      {/* Content, vertically centered */}
      <div className="container h-full">
        <div className="flex h-full items-center py-20 md:py-28">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-mont), ui-sans-serif' }}
            >
              Summit Chronicles
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200"
              style={{ fontFamily: 'var(--font-lora), ui-serif' }}
            >
              Stories from the World’s Highest Peaks
            </motion.p>

            {/* Ultra‑minimal Apple‑style CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="mt-10"
            >
              <Link href="/expeditions" className="group inline-flex items-center gap-2 text-white">
                <span className="relative text-lg md:text-xl">
                  Explore the story
                  <span
                    className="absolute left-0 -bottom-1 h-[1.5px] w-0 bg-[var(--gold)] transition-all duration-300 group-hover:w-full"
                    aria-hidden="true"
                  />
                </span>
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
