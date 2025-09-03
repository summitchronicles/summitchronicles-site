"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  BookOpenIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";

const categories = ["All", "Training", "Expeditions", "Gear", "Mental", "Nutrition", "Recovery"];

const blogPosts = [
  {
    id: "altitude-training-guide",
    title: "The Complete Guide to Altitude Training: From Sea Level to Summit",
    excerpt: "Master the art of altitude training with proven strategies, scientific insights, and real expedition experience. Learn how to prepare your body for the thin air of high peaks.",
    content: "Training for high altitude requires a systematic approach...",
    category: "Training",
    author: "Summit Chronicles",
    publishDate: "2024-02-15",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Altitude", "Training", "Preparation", "Physiology"],
    featured: true,
    views: 2847,
    likes: 189,
    comments: 23,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "kilimanjaro-lessons",
    title: "7 Hard-Won Lessons from Kilimanjaro: What They Don't Tell You",
    excerpt: "Beyond the guidebooks and travel blogs - the real insights from my first Seven Summits attempt. What I wish I knew before stepping foot on Africa's highest peak.",
    content: "Standing at Uhuru Peak changed everything...",
    category: "Expeditions",
    author: "Summit Chronicles",
    publishDate: "2024-01-28",
    readTime: "8 min", 
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Kilimanjaro", "Lessons", "First Summit", "Africa"],
    featured: false,
    views: 1923,
    likes: 134,
    comments: 31,
    color: "from-orange-500 to-red-600"
  },
  {
    id: "mental-preparation-guide",
    title: "The Mental Game: Psychological Preparation for Extreme Altitude",
    excerpt: "The mountains test your mind as much as your body. Develop mental resilience, overcome fear, and build the psychological foundation for summit success.",
    content: "Your mind is your most powerful tool on the mountain...",
    category: "Mental",
    author: "Summit Chronicles",
    publishDate: "2024-01-15",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1464822759844-d150ad6d1a32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Psychology", "Mental Training", "Fear", "Mindset"],
    featured: true,
    views: 3241,
    likes: 267,
    comments: 45,
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "nutrition-high-altitude",
    title: "Fueling at Altitude: Nutrition Strategies for Peak Performance",
    excerpt: "Discover how altitude affects your metabolism and appetite. Learn the nutritional strategies that keep you strong from base camp to summit.",
    content: "Eating at altitude is a different game entirely...",
    category: "Nutrition",
    author: "Summit Chronicles", 
    publishDate: "2023-12-22",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Nutrition", "Altitude", "Performance", "Recovery"],
    featured: false,
    views: 1567,
    likes: 98,
    comments: 17,
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "gear-weight-optimization",
    title: "Every Gram Counts: Optimizing Your Pack for Efficiency",
    excerpt: "The art of ultralight mountaineering. Learn how to cut pack weight without compromising safety, based on lessons from multiple expeditions.",
    content: "Weight is the enemy of endurance...",
    category: "Gear",
    author: "Summit Chronicles",
    publishDate: "2023-12-08",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Ultralight", "Gear", "Efficiency", "Pack Weight"],
    featured: false,
    views: 2156,
    likes: 145,
    comments: 28,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "recovery-techniques",
    title: "Recovery Protocols: Bouncing Back from Extreme Expeditions",
    excerpt: "How to recover properly after pushing your limits. Evidence-based recovery strategies for both body and mind after high-altitude challenges.",
    content: "Recovery is where adaptation happens...",
    category: "Recovery",
    author: "Summit Chronicles",
    publishDate: "2023-11-25",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    tags: ["Recovery", "Adaptation", "Rest", "Performance"],
    featured: false,
    views: 1834,
    likes: 112,
    comments: 19,
    color: "from-teal-500 to-cyan-600"
  }
];

export default function BlogPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  return (
    <main ref={ref} className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-summitGold/10 border border-summitGold/20 rounded-full px-4 py-2 text-sm text-summitGold mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpenIcon className="w-4 h-4" />
              Mountain Wisdom
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Chronicles from the <span className="text-summitGold">Heights</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Deep insights, hard-won lessons, and practical wisdom from the world&rsquo;s highest peaks. 
              Real experiences, honest reflections, and actionable knowledge.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-center gap-4">
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
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-white mb-8"
            >
              Featured Articles
            </motion.h2>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
            >
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={item}
                  whileHover={{ scale: 1.02, y: -10 }}
                  className="group relative cursor-pointer"
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                    {/* Featured Image */}
                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-summitGold/20 border border-summitGold/30 rounded-full text-xs font-medium text-summitGold">
                        {post.category}
                      </div>

                      {/* Stats */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-white/80">
                        <span className="flex items-center gap-1">
                          <EyeIcon className="w-3 h-3" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-3 h-3" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <ChatBubbleBottomCenterTextIcon className="w-3 h-3" />
                          {post.comments}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(post.publishDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserIcon className="w-3 h-3" />
                          {post.author}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-summitGold transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-white/70 leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-white/80 hover:text-summitGold transition-colors duration-300 group/button"
                      >
                        <span className="text-sm font-medium">Read Full Article</span>
                        <motion.div
                          className="group-hover/button:translate-x-1 transition-transform duration-300"
                        >
                          <ArrowRightIcon className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                    </div>

                    {/* Hover Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                  </div>

                  {/* External Glow */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${post.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`} />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          {regularPosts.length > 0 && (
            <>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold text-white mb-8"
              >
                Latest Articles
              </motion.h2>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    variants={item}
                    whileHover={{ scale: 1.02, y: -8 }}
                    className="group relative cursor-pointer"
                  >
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <motion.img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-4 right-4 px-2 py-1 bg-alpineBlue/20 border border-alpineBlue/30 rounded-full text-xs font-medium text-alpineBlue">
                          {post.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3 text-xs text-white/60">
                          <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                          <span>•</span>
                          <span>{post.views.toLocaleString()} views</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-summitGold transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <span className="flex items-center gap-1">
                              <HeartIcon className="w-3 h-3" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <ChatBubbleBottomCenterTextIcon className="w-3 h-3" />
                              {post.comments}
                            </span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
                          >
                            <ShareIcon className="w-4 h-4 text-white/60 hover:text-alpineBlue" />
                          </motion.button>
                        </div>

                        {/* Hover Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${post.color}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                      </div>
                    </div>

                    {/* External Glow */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${post.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`} />
                  </motion.article>
                ))}
              </motion.div>
            </>
          )}

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-white/60">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}