"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";
import Image from "next/image";
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  TrophyIcon,
  MapPinIcon,
  CameraIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface ExpeditionPhoto {
  url: string;
  alt: string;
  caption: string;
}

interface Expedition {
  id: number;
  date: string;
  peak: string;
  continent: string;
  country: string;
  status: 'completed' | 'in-progress' | 'planned' | 'future';
  story: string;
  elevation: string;
  difficulty: 'Moderate' | 'Challenging' | 'Technical' | 'Very Technical' | 'Extremely Technical';
  lessons: string[];
  photos: ExpeditionPhoto[];
  stats?: {
    duration: string;
    temperature: string;
    conditions: string;
  };
  completedDate?: string;
}

const expeditions: Expedition[] = [
  {
    id: 1,
    date: "July 2022",
    peak: "Mount Elbrus",
    continent: "Europe",
    country: "Russia",
    status: "completed",
    completedDate: "July 15, 2022",
    story: "My first major summit. The weather window was perfect, but I learned hard lessons about proper acclimatization and the importance of starting early. The descent in whiteout conditions taught me respect for mountain weather.",
    elevation: "5,642m",
    difficulty: "Moderate",
    lessons: ["Weather can change instantly", "Proper layering is crucial", "Mental preparation matters as much as physical"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        alt: "Mount Elbrus summit approach",
        caption: "Final summit push at sunrise"
      },
      {
        url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
        alt: "Summit celebration",
        caption: "First Seven Summits peak conquered"
      }
    ],
    stats: {
      duration: "7 days",
      temperature: "-15°C",
      conditions: "Clear summit day"
    }
  },
  {
    id: 2,
    date: "March 2023",
    peak: "Mount Kilimanjaro",
    continent: "Africa", 
    country: "Tanzania",
    status: "completed",
    completedDate: "March 22, 2023",
    story: "The Machame route via Barranco Wall. This climb taught me about altitude sickness management and the importance of 'pole pole' (slowly slowly). The sunrise at Uhuru Peak was life-changing.",
    elevation: "5,895m",
    difficulty: "Moderate",
    lessons: ["Altitude affects everyone differently", "Mental toughness on summit day", "Proper hydration is critical"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800&q=80",
        alt: "Kilimanjaro sunrise",
        caption: "Unforgettable sunrise at Uhuru Peak"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", 
        alt: "Barranco Wall climb",
        caption: "Technical Barranco Wall section"
      }
    ],
    stats: {
      duration: "6 days", 
      temperature: "-10°C",
      conditions: "Perfect summit weather"
    }
  },
  {
    id: 3,
    date: "December 2023",
    peak: "Aconcagua",
    continent: "South America",
    country: "Argentina", 
    status: "completed",
    completedDate: "December 28, 2023",
    story: "The Stone Sentinel pushed me to my limits. High winds, brutal cold, and my first real experience with high altitude. I had to turn back once due to weather, but returned stronger and made the summit on my second attempt.",
    elevation: "6,961m",
    difficulty: "Technical",
    lessons: ["Know when to turn back", "High altitude changes everything", "Proper gear can save your life"],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1551524164-6cf2ac11f6ba?w=800&q=80",
        alt: "Aconcagua base camp",
        caption: "Base camp with the summit in view"
      },
      {
        url: "https://images.unsplash.com/photo-1464822759844-d150ad6c7c8c?w=800&q=80",
        alt: "High altitude conditions", 
        caption: "Battling extreme winds and cold"
      }
    ],
    stats: {
      duration: "14 days",
      temperature: "-25°C", 
      conditions: "High winds, challenging"
    }
  },
  {
    id: 4,
    date: "June 2025",
    peak: "Mount McKinley (Denali)",
    continent: "North America",
    country: "Alaska, USA",
    status: "planned",
    story: "My next major challenge. Denali's extreme cold and technical climbing sections will test everything I've learned so far. Currently in intensive cold weather training and crevasse rescue practice.",
    elevation: "6,190m",
    difficulty: "Very Technical",
    lessons: ["Currently preparing..."],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        alt: "Denali preparation",
        caption: "Cold weather training preparation"
      }
    ],
    stats: {
      duration: "18 days planned",
      temperature: "-40°C expected",
      conditions: "Extreme cold conditions"
    }
  },
  {
    id: 5,
    date: "May 2027",
    peak: "Mount Everest", 
    continent: "Asia",
    country: "Nepal",
    status: "future",
    story: "The ultimate goal. Everything has been building toward this moment. Two years of preparation, training, and gaining experience on the previous summits. This is why I started the Seven Summits journey.",
    elevation: "8,849m",
    difficulty: "Extremely Technical", 
    lessons: ["The ultimate test awaits..."],
    photos: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        alt: "Everest future goal",
        caption: "The ultimate summit goal"
      }
    ],
    stats: {
      duration: "60+ days planned",
      temperature: "-35°C expected",
      conditions: "Death zone conditions"
    }
  }
];

const getStatusColor = (status: Expedition['status']) => {
  switch (status) {
    case 'completed': return 'text-successGreen bg-successGreen/10 border-successGreen/20';
    case 'in-progress': return 'text-summitGold bg-summitGold/10 border-summitGold/20';
    case 'planned': return 'text-alpineBlue bg-alpineBlue/10 border-alpineBlue/20';
    case 'future': return 'text-stoneGray bg-stoneGray/10 border-stoneGray/20';
    default: return 'text-stoneGray bg-stoneGray/10 border-stoneGray/20';
  }
};

const getStatusIcon = (status: Expedition['status']) => {
  switch (status) {
    case 'completed': return <CheckCircleIcon className="w-5 h-5" />;
    case 'in-progress': return <ClockIcon className="w-5 h-5" />;
    case 'planned': return <CalendarIcon className="w-5 h-5" />;
    case 'future': return <TrophyIcon className="w-5 h-5" />;
    default: return <TrophyIcon className="w-5 h-5" />;
  }
};

const getDifficultyColor = (difficulty: Expedition['difficulty']) => {
  switch (difficulty) {
    case 'Moderate': return 'text-successGreen';
    case 'Challenging': return 'text-summitGold';
    case 'Technical': return 'text-warningOrange';
    case 'Very Technical': return 'text-alpineBlue';
    case 'Extremely Technical': return 'text-dangerRed';
    default: return 'text-stoneGray';
  }
};

export default function ExpeditionTimeline() {
  const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<ExpeditionPhoto | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-alpineBlue/10 border border-alpineBlue/20 rounded-full px-4 py-2 text-sm text-alpineBlue mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <CalendarIcon className="w-4 h-4" />
            Expedition Timeline
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            My Seven Summits{" "}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Journey Timeline
            </span>
          </h2>
          
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            A chronological journey through each summit attempt, from my first peak to the ultimate Everest goal. 
            Real stories, lessons learned, and the authentic challenges of high-altitude mountaineering.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-summitGold via-alpineBlue to-successGreen transform md:-translate-x-1/2" />
          
          {/* Expeditions */}
          <div className="space-y-16">
            {expeditions.map((expedition, index) => (
              <motion.div
                key={expedition.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={clsx(
                  "relative flex items-center",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10">
                  <motion.div
                    className={clsx(
                      "w-16 h-16 rounded-full border-4 flex items-center justify-center",
                      getStatusColor(expedition.status),
                      "bg-black"
                    )}
                    whileHover={{ scale: 1.1 }}
                    animate={expedition.status === 'in-progress' ? {
                      scale: [1, 1.05, 1],
                      boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.7)", "0 0 0 10px rgba(245, 158, 11, 0)", "0 0 0 0 rgba(245, 158, 11, 0)"]
                    } : {}}
                    transition={expedition.status === 'in-progress' ? { duration: 2, repeat: Infinity } : {}}
                  >
                    {getStatusIcon(expedition.status)}
                  </motion.div>
                </div>

                {/* Content */}
                <div className={clsx(
                  "flex-1 ml-28 md:ml-0",
                  index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                )}>
                  <motion.div
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedExpedition(expedition)}
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{expedition.peak}</h3>
                        <div className="flex items-center gap-4 text-white/60">
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {expedition.continent}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {expedition.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrophyIcon className="w-4 h-4" />
                            {expedition.elevation}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
                        <div className={clsx(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium",
                          getStatusColor(expedition.status)
                        )}>
                          {getStatusIcon(expedition.status)}
                          <span className="capitalize">{expedition.status.replace('-', ' ')}</span>
                        </div>
                        <div className={clsx(
                          "text-sm font-medium",
                          getDifficultyColor(expedition.difficulty)
                        )}>
                          {expedition.difficulty}
                        </div>
                      </div>
                    </div>

                    {/* Photos */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {expedition.photos.slice(0, 2).map((photo, photoIndex) => (
                        <motion.div
                          key={photoIndex}
                          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                          whileHover={{ scale: 1.05 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhoto(photo);
                          }}
                        >
                          <Image
                            src={photo.url}
                            alt={photo.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <CameraIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium bg-black/60 backdrop-blur-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {photo.caption}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Story */}
                    <p className="text-white/80 leading-relaxed mb-6">{expedition.story}</p>

                    {/* Stats */}
                    {expedition.stats && (
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-summitGold">{expedition.stats.duration}</div>
                          <div className="text-xs text-white/60">Duration</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-alpineBlue">{expedition.stats.temperature}</div>
                          <div className="text-xs text-white/60">Temperature</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-successGreen">{expedition.stats.conditions}</div>
                          <div className="text-xs text-white/60">Conditions</div>
                        </div>
                      </div>
                    )}

                    {/* Lessons */}
                    {expedition.lessons.length > 0 && expedition.lessons[0] !== "Currently preparing..." && expedition.lessons[0] !== "The ultimate test awaits..." && expedition.lessons[0] !== "Future expedition..." && (
                      <div>
                        <h4 className="text-sm font-semibold text-summitGold mb-3 uppercase tracking-wide">
                          Key Lessons
                        </h4>
                        <ul className="space-y-2">
                          {expedition.lessons.map((lesson, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-summitGold rounded-full mt-2 flex-shrink-0" />
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">{selectedPhoto.caption}</h3>
              <p className="text-white/70">{selectedPhoto.alt}</p>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}