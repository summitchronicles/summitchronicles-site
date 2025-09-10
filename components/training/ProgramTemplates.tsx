'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Target, 
  Users, 
  Star, 
  Copy,
  Edit,
  Share2,
  Mountain,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
  BookOpen,
  Download
} from 'lucide-react';
import { TrainingProgram, UserProfile } from '@/lib/multi-user/types';

interface ProgramTemplatesProps {
  userProfile: UserProfile;
  onProgramSelect?: (program: TrainingProgram) => void;
  onCreateNew?: () => void;
  mode?: 'browse' | 'manage' | 'assign';
}

interface FilterState {
  difficulty: string;
  summit: string;
  duration: string;
  focus: string;
  priceRange: string;
}

export default function ProgramTemplates({
  userProfile,
  onProgramSelect,
  onCreateNew,
  mode = 'browse'
}: ProgramTemplatesProps) {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [myPrograms, setMyPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'templates' | 'my_programs' | 'recommended'>('templates');
  const [filters, setFilters] = useState<FilterState>({
    difficulty: 'all',
    summit: 'all',
    duration: 'all',
    focus: 'all',
    priceRange: 'all'
  });
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const summitOptions = [
    'Everest', 'Aconcagua', 'Denali', 'Kilimanjaro', 
    'Elbrus', 'Vinson', 'Carstensz Pyramid', 'General Training'
  ];

  const focusAreas = [
    'Cardiovascular Endurance', 'Strength Training', 'Altitude Acclimatization',
    'Technical Skills', 'Mental Preparation', 'Recovery & Mobility'
  ];

  useEffect(() => {
    loadPrograms();
  }, [activeTab, userProfile]);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/training/programs';
      let params = new URLSearchParams();

      switch (activeTab) {
        case 'templates':
          params.append('action', 'public_templates');
          break;
        case 'my_programs':
          params.append('action', 'my_programs');
          break;
        case 'recommended':
          params.append('action', 'recommended');
          break;
      }

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPrograms(data.programs || []);
        if (activeTab === 'my_programs') {
          setMyPrograms(data.programs || []);
        }
      }
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloneProgram = async (program: TrainingProgram) => {
    try {
      const response = await fetch('/api/training/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clone_template',
          template_id: program.id,
          customizations: {
            name: `${program.name} (My Copy)`,
            is_public: false
          }
        })
      });

      const data = await response.json();
      if (response.ok) {
        loadPrograms();
      }
    } catch (error) {
      console.error('Failed to clone program:', error);
    }
  };

  const handlePublishTemplate = async (program: TrainingProgram) => {
    try {
      const response = await fetch('/api/training/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish_template',
          program_id: program.id
        })
      });

      if (response.ok) {
        loadPrograms();
      }
    } catch (error) {
      console.error('Failed to publish template:', error);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filters.difficulty === 'all' || 
                             program.difficulty_level === filters.difficulty;
    
    const matchesSummit = filters.summit === 'all' || 
                         program.target_summit === filters.summit;
    
    const matchesDuration = filters.duration === 'all' || 
                           (filters.duration === 'short' && program.duration_weeks <= 12) ||
                           (filters.duration === 'medium' && program.duration_weeks > 12 && program.duration_weeks <= 24) ||
                           (filters.duration === 'long' && program.duration_weeks > 24);

    return matchesSearch && matchesDifficulty && matchesSummit && matchesDuration;
  });

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ProgramCard = ({ program }: { program: TrainingProgram }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {program.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {program.description}
            </p>
          </div>
          {program.is_template && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Template
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{program.duration_weeks} weeks</span>
          </div>
          {program.target_summit && (
            <div className="flex items-center text-gray-600">
              <Mountain className="w-4 h-4 mr-2" />
              <span className="text-sm">{program.target_summit}</span>
            </div>
          )}
          {program.estimated_hours_per_week && (
            <div className="flex items-center text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="text-sm">{program.estimated_hours_per_week}h/week</span>
            </div>
          )}
          {program.difficulty_level && (
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-gray-400" />
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(program.difficulty_level)}`}>
                {program.difficulty_level}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {program.focus_areas.slice(0, 3).map((area, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {area}
            </span>
          ))}
          {program.focus_areas.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{program.focus_areas.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {mode === 'browse' && (
              <>
                <button
                  onClick={() => handleCloneProgram(program)}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Clone
                </button>
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Details
                </button>
              </>
            )}
            {mode === 'manage' && program.created_by === userProfile.id && (
              <>
                <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                {!program.is_public && (
                  <button
                    onClick={() => handlePublishTemplate(program)}
                    className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Publish
                  </button>
                )}
              </>
            )}
            {mode === 'assign' && (
              <button
                onClick={() => onProgramSelect?.(program)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Users className="w-4 h-4 mr-1" />
                Assign
              </button>
            )}
          </div>
          
          {program.price && program.price > 0 && (
            <span className="text-sm font-medium text-gray-900">
              ${program.price}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Training Programs</h2>
          <p className="text-gray-600">
            {mode === 'browse' && "Browse and clone professional training templates"}
            {mode === 'manage' && "Manage your training programs and templates"}
            {mode === 'assign' && "Select programs to assign to clients"}
          </p>
        </div>
        {mode === 'manage' && (
          <button
            onClick={onCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Create Program
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Public Templates
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recommended'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recommended
        </button>
        {(userProfile.role === 'trainer' || userProfile.role === 'admin') && (
          <button
            onClick={() => setActiveTab('my_programs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my_programs'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Programs
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap lg:flex-nowrap">
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>

          <select
            value={filters.summit}
            onChange={(e) => setFilters(prev => ({ ...prev, summit: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Summits</option>
            {summitOptions.map(summit => (
              <option key={summit} value={summit}>{summit}</option>
            ))}
          </select>

          <select
            value={filters.duration}
            onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Any Duration</option>
            <option value="short">Short (≤12 weeks)</option>
            <option value="medium">Medium (13-24 weeks)</option>
            <option value="long">Long (24+ weeks)</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrograms.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          {mode === 'manage' && (
            <button
              onClick={onCreateNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Program
            </button>
          )}
        </div>
      )}

      {/* Program Details Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedProgram.name}
                    </h3>
                    <p className="text-gray-600">
                      {selectedProgram.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight className="w-5 h-5 transform rotate-45" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="font-medium">Duration</span>
                    </div>
                    <p className="text-gray-900">{selectedProgram.duration_weeks} weeks</p>
                  </div>
                  
                  {selectedProgram.estimated_hours_per_week && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="font-medium">Time Commitment</span>
                      </div>
                      <p className="text-gray-900">{selectedProgram.estimated_hours_per_week} hours/week</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Training Phases</h4>
                  <div className="space-y-3">
                    {selectedProgram.phases.map((phase, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{phase.phase_name}</span>
                          <span className="text-sm text-gray-600">{phase.duration_weeks} weeks</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.key_adaptations.map((adaptation, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {adaptation}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleCloneProgram(selectedProgram)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Clone Program
                  </button>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}