'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Cog6ToothIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  HeartIcon,
  ShareIcon,
  CheckIcon,
  XMarkIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const categories = [
  'All',
  'Footwear',
  'Clothing',
  'Hardware',
  'Electronics',
  'Safety',
  'Nutrition',
];

const gearItems = [
  {
    id: 'la-sportiva-boots',
    name: 'La Sportiva Nepal Cube GTX',
    category: 'Footwear',
    brand: 'La Sportiva',
    price: '$549',
    rating: 4.8,
    reviews: 127,
    image:
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    testedOn: ['Kilimanjaro', 'Aconcagua'],
    pros: ['Exceptional warmth', 'Crampon compatible', 'Waterproof'],
    cons: ['Heavy', 'Long break-in period'],
    description:
      'The gold standard for high-altitude mountaineering boots. Field-tested on multiple expeditions.',
    myRating: 5,
    recommended: true,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'arcteryx-jacket',
    name: "Arc'teryx Alpha SV Jacket",
    category: 'Clothing',
    brand: "Arc'teryx",
    price: '$750',
    rating: 4.9,
    reviews: 89,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    testedOn: ['Aconcagua', 'Training'],
    pros: [
      'Bombproof construction',
      'Excellent breathability',
      'Hood fits over helmet',
    ],
    cons: ['Expensive', 'Loud fabric'],
    description:
      'The most durable shell jacket money can buy. Has never failed me in extreme conditions.',
    myRating: 5,
    recommended: true,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'bd-crampons',
    name: 'Black Diamond Sabretooth Pro',
    category: 'Hardware',
    brand: 'Black Diamond',
    price: '$199',
    rating: 4.7,
    reviews: 156,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    testedOn: ['Aconcagua', 'Ice Training'],
    pros: ['Aggressive front points', 'Dual bail system', 'Lightweight'],
    cons: ['Complex adjustment', 'Front points can dull quickly'],
    description:
      'Technical crampons that excel on steep ice and mixed terrain. A bit overkill for basic mountaineering.',
    myRating: 4,
    recommended: true,
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'garmin-watch',
    name: 'Garmin Fenix 7X Sapphire',
    category: 'Electronics',
    brand: 'Garmin',
    price: '$899',
    rating: 4.6,
    reviews: 234,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    testedOn: ['All expeditions'],
    pros: ['Incredible battery life', 'GPS accuracy', 'Comprehensive tracking'],
    cons: ['Bulky', 'Complex interface', 'Expensive'],
    description:
      'The ultimate adventure watch. Tracks everything and never dies. Essential for navigation and training analysis.',
    myRating: 4,
    recommended: true,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'petzl-headlamp',
    name: 'Petzl NAO RL',
    category: 'Electronics',
    brand: 'Petzl',
    price: '$199',
    rating: 4.5,
    reviews: 78,
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    testedOn: ['Night training', 'Kilimanjaro'],
    pros: ['Reactive lighting', 'USB rechargeable', 'Comfortable'],
    cons: ['Battery life in cold', 'Expensive replacement'],
    description:
      'Smart headlamp that adjusts brightness automatically. Great for technical work but watch the battery in cold.',
    myRating: 4,
    recommended: true,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'msr-tent',
    name: 'MSR Access 2',
    category: 'Hardware',
    brand: 'MSR',
    price: '$649',
    rating: 4.3,
    reviews: 92,
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    testedOn: ['Base camps'],
    pros: ['4-season durability', 'Easy setup', 'Great vestibule'],
    cons: ['Heavy', 'Condensation issues'],
    description:
      'Solid 4-season tent that handles weather well. A bit heavy for backpacking but perfect for base camps.',
    myRating: 4,
    recommended: true,
    color: 'from-purple-500 to-violet-500',
  },
];

export default function GearPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const filteredGear = gearItems
    .filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return (
            parseInt(b.price.replace('$', '')) -
            parseInt(a.price.replace('$', ''))
          );
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>
        {i < Math.floor(rating) ? (
          <StarSolid className={`${size} text-summitGold`} />
        ) : i < rating ? (
          <div className="relative">
            <StarIcon className={`${size} text-gray-400`} />
            <StarSolid
              className={`${size} text-summitGold absolute inset-0`}
              style={{ clipPath: `inset(0 ${100 - (rating - i) * 100}% 0 0)` }}
            />
          </div>
        ) : (
          <StarIcon className={`${size} text-gray-400`} />
        )}
      </span>
    ));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  return (
    <main
      ref={ref}
      className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden"
    >
      {/* Hero Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-alpineBlue/10 border border-alpineBlue/20 rounded-full px-4 py-2 text-sm text-alpineBlue mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Cog6ToothIcon className="w-4 h-4" />
              Field-Tested Reviews
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Gear <span className="text-summitGold">Arsenal</span>
            </h1>

            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              In-depth reviews of mountaineering gear tested in real expedition
              conditions. From summit to base camp, discover what works when it
              matters most.
            </p>
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto mb-16"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-white/50" />
              </div>
              <input
                type="text"
                placeholder="Search gear by name, brand, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-summitGold text-black'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/60 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-summitGold/50"
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gear Grid */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          {filteredGear.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No gear found
              </h3>
              <p className="text-white/60">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredGear.map((gear, index) => (
                <motion.div
                  key={gear.id}
                  variants={item}
                  whileHover={{ scale: 1.02, y: -10 }}
                  className="group relative"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                    {/* Image Header */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={gear.image}
                        alt={gear.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Recommendation Badge */}
                      {gear.recommended && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="absolute top-4 right-4 px-3 py-1 bg-successGreen/20 border border-successGreen/30 rounded-full text-xs font-medium text-successGreen"
                        >
                          Recommended
                        </motion.div>
                      )}

                      {/* My Rating */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-1">
                        {renderStars(gear.myRating)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-summitGold transition-colors duration-300 line-clamp-2">
                            {gear.name}
                          </h3>
                          <span className="text-summitGold font-semibold text-lg ml-2">
                            {gear.price}
                          </span>
                        </div>
                        <p className="text-alpineBlue text-sm font-medium">
                          {gear.brand} • {gear.category}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1">
                          {renderStars(gear.rating)}
                        </div>
                        <span className="text-white text-sm font-medium">
                          {gear.rating}
                        </span>
                        <span className="text-white/50 text-sm">
                          ({gear.reviews} reviews)
                        </span>
                      </div>

                      {/* Tested On */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {gear.testedOn.map((expedition, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80"
                          >
                            {expedition}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-white/70 text-sm leading-relaxed mb-6 line-clamp-3">
                        {gear.description}
                      </p>

                      {/* Pros/Cons */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-successGreen text-xs font-medium mb-2 flex items-center gap-1">
                            <HandThumbUpIcon className="w-3 h-3" />
                            Pros
                          </h4>
                          <ul className="space-y-1">
                            {gear.pros.slice(0, 2).map((pro, idx) => (
                              <li
                                key={idx}
                                className="text-white/60 text-xs flex items-center gap-1"
                              >
                                <CheckIcon className="w-3 h-3 text-successGreen flex-shrink-0" />
                                <span className="truncate">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-red-400 text-xs font-medium mb-2 flex items-center gap-1">
                            <HandThumbDownIcon className="w-3 h-3" />
                            Cons
                          </h4>
                          <ul className="space-y-1">
                            {gear.cons.slice(0, 2).map((con, idx) => (
                              <li
                                key={idx}
                                className="text-white/60 text-xs flex items-center gap-1"
                              >
                                <XMarkIcon className="w-3 h-3 text-red-400 flex-shrink-0" />
                                <span className="truncate">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 text-white/80 hover:text-summitGold transition-colors duration-300 group/button"
                        >
                          <span className="text-sm font-medium">
                            Full Review
                          </span>
                          <motion.div className="group-hover/button:translate-x-1 transition-transform duration-300">
                            <ArrowRightIcon className="w-4 h-4" />
                          </motion.div>
                        </motion.button>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                          >
                            <HeartIcon className="w-4 h-4 text-white/60 hover:text-red-400" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                          >
                            <ShareIcon className="w-4 h-4 text-white/60 hover:text-alpineBlue" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Hover Glow */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${gear.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                      />
                    </div>
                  </div>

                  {/* External Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gear.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
