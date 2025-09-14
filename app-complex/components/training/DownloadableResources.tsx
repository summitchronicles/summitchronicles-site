"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  HeartIcon,
  MapIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'checklist' | 'guide' | 'workbook';
  category: 'training' | 'safety' | 'gear' | 'mental' | 'nutrition';
  pages: number;
  downloadCount: number;
  isPremium: boolean;
  previewUrl?: string;
  downloadUrl: string;
}

export default function DownloadableResources() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [emailForDownload, setEmailForDownload] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState<string | null>(null);

  const resources: Resource[] = [
    {
      id: '12-week-foundation',
      title: '12-Week Foundation Training Plan',
      description: 'Complete beginner to summit-ready progression with weekly schedules, exercise descriptions, and progress tracking.',
      type: 'pdf',
      category: 'training',
      pages: 24,
      downloadCount: 1847,
      isPremium: false,
      downloadUrl: '/downloads/12-week-foundation.pdf'
    },
    {
      id: 'gear-checklist',
      title: 'Summit-Specific Gear Checklists',
      description: 'Detailed equipment lists for each of the Seven Summits, with weight optimization and budget alternatives.',
      type: 'checklist',
      category: 'gear',
      pages: 16,
      downloadCount: 2134,
      isPremium: false,
      downloadUrl: '/downloads/gear-checklists.pdf'
    },
    {
      id: 'safety-protocols',
      title: 'Mountain Safety & Risk Assessment Guide',
      description: 'My decision-making framework for mountain safety, emergency protocols, and risk management strategies.',
      type: 'guide',
      category: 'safety',
      pages: 32,
      downloadCount: 1456,
      isPremium: true,
      downloadUrl: '/downloads/safety-protocols.pdf'
    },
    {
      id: 'mental-prep-workbook',
      title: 'Mental Preparation Workbook',
      description: 'Exercises for fear management, goal setting, and building mental resilience for challenging climbs.',
      type: 'workbook',
      category: 'mental',
      pages: 28,
      downloadCount: 987,
      isPremium: true,
      downloadUrl: '/downloads/mental-prep-workbook.pdf'
    },
    {
      id: 'altitude-nutrition',
      title: 'High-Altitude Nutrition Guide',
      description: 'Meal planning, caloric requirements, and nutrition strategies for extended high-altitude expeditions.',
      type: 'guide',
      category: 'nutrition',
      pages: 20,
      downloadCount: 1234,
      isPremium: false,
      downloadUrl: '/downloads/altitude-nutrition.pdf'
    },
    {
      id: 'everest-protocol',
      title: 'Everest 2027 Training Protocol',
      description: 'The exact 18-month training plan I\'m using to prepare for Everest, including hypoxic training schedules.',
      type: 'pdf',
      category: 'training',
      pages: 48,
      downloadCount: 756,
      isPremium: true,
      downloadUrl: '/downloads/everest-protocol.pdf'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: DocumentTextIcon },
    { id: 'training', label: 'Training Plans', icon: HeartIcon },
    { id: 'gear', label: 'Gear Guides', icon: MapIcon },
    { id: 'safety', label: 'Safety Protocols', icon: ShieldCheckIcon },
    { id: 'mental', label: 'Mental Prep', icon: AcademicCapIcon },
    { id: 'nutrition', label: 'Nutrition', icon: ClipboardDocumentListIcon }
  ];

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'pdf': return DocumentTextIcon;
      case 'checklist': return ClipboardDocumentListIcon;
      case 'guide': return MapIcon;
      case 'workbook': return AcademicCapIcon;
      default: return DocumentTextIcon;
    }
  };

  const getCategoryColor = (category: Resource['category']) => {
    switch (category) {
      case 'training': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'gear': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'safety': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'mental': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'nutrition': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const handleDownload = (resource: Resource) => {
    if (resource.isPremium) {
      setShowEmailCapture(resource.id);
    } else {
      // Direct download for free resources
      window.open(resource.downloadUrl, '_blank');
    }
  };

  const handlePremiumDownload = (resourceId: string) => {
    if (emailForDownload) {
      // In a real implementation, this would:
      // 1. Save email to database
      // 2. Send download link via email
      // 3. Track conversion
      alert(`Download link sent to ${emailForDownload}!`);
      setShowEmailCapture(null);
      setEmailForDownload('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-summitGold text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => {
          const TypeIcon = getTypeIcon(resource.type);
          
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 relative"
            >
              {/* Premium Badge */}
              {resource.isPremium && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-summitGold/20 text-summitGold rounded-full text-xs">
                  <LockClosedIcon className="w-3 h-3" />
                  Premium
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <TypeIcon className="w-6 h-6 text-summitGold" />
                </div>
                <div className="flex-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(resource.category)} mb-2`}>
                    {resource.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                </div>
              </div>

              <p className="text-white/70 text-sm leading-relaxed mb-4">
                {resource.description}
              </p>

              <div className="flex items-center justify-between text-xs text-white/60 mb-6">
                <span>{resource.pages} pages</span>
                <span>{resource.downloadCount.toLocaleString()} downloads</span>
              </div>

              {/* Email Capture for Premium Resources */}
              {showEmailCapture === resource.id ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    placeholder="Enter your email for instant download"
                    value={emailForDownload}
                    onChange={(e) => setEmailForDownload(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-summitGold/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePremiumDownload(resource.id)}
                      disabled={!emailForDownload}
                      className="flex-1 px-4 py-2 bg-summitGold text-black text-sm font-medium rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                      Get Download Link
                    </button>
                    <button
                      onClick={() => setShowEmailCapture(null)}
                      className="px-4 py-2 border border-white/20 text-white text-sm rounded-lg hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  <p className="text-white/50 text-xs">
                    No spam. Unsubscribe anytime. Download link valid for 48 hours.
                  </p>
                </motion.div>
              ) : (
                <button
                  onClick={() => handleDownload(resource)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  {resource.isPremium ? 'Get Free Access' : 'Download Now'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-summitGold mb-1">
              {resources.length}
            </div>
            <div className="text-white/60 text-sm">Total Resources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-summitGold mb-1">
              {resources.reduce((total, r) => total + r.downloadCount, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Total Downloads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-summitGold mb-1">
              {resources.reduce((total, r) => total + r.pages, 0)}
            </div>
            <div className="text-white/60 text-sm">Pages of Content</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}