"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { trackAIInteraction } from "@/lib/analytics";
import { 
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  BoltIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  BookOpenIcon,
  MapIcon,
  Cog6ToothIcon,
  FunnelIcon,
  CalendarDaysIcon,
  TagIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const popularQuestions = [
  {
    icon: MapIcon,
    question: "What's the best training plan for Everest?",
    category: "Training"
  },
  {
    icon: Cog6ToothIcon,
    question: "Which boots should I use for technical climbing?",
    category: "Gear"
  },
  {
    icon: BookOpenIcon,
    question: "How do you prepare mentally for high altitude?",
    category: "Preparation"
  },
  {
    icon: ClockIcon,
    question: "What's the ideal acclimatization timeline?",
    category: "Health"
  }
];

const categories = [
  { id: 'all', label: 'All Topics', icon: SparklesIcon },
  { id: 'training', label: 'Training', icon: BoltIcon },
  { id: 'gear', label: 'Gear', icon: Cog6ToothIcon },
  { id: 'expeditions', label: 'Expeditions', icon: MapIcon },
  { id: 'health', label: 'Health & Safety', icon: BookOpenIcon },
  { id: 'general', label: 'General', icon: ChatBubbleBottomCenterTextIcon }
];

const timeFilters = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' }
];

export default function AskPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, timestamp: Date, category: string}>>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer("");
    const startTime = Date.now();
    
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          q: question,
          context: conversationHistory.slice(0, 3).map(h => ({ 
            question: h.question, 
            answer: h.answer 
          }))
        }),
      });
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      const newAnswer = data.error ? "❌ " + data.error : (data.answer || "No answer received.");
      setAnswer(newAnswer);
      
      // Track AI interaction
      const questionCategory = getQuestionCategory(question);
      trackAIInteraction({
        question,
        questionCategory,
        responseTime,
        responseLength: newAnswer.length,
        sourcesCount: data.sources?.length || 0,
        errorOccurred: !!data.error,
        errorType: data.error ? 'api_error' : undefined
      });
      
      // Add to conversation history
      setConversationHistory(prev => [
        { question, answer: newAnswer, timestamp: new Date(), category: questionCategory },
        ...prev
      ]);
      
      setQuestion(""); // Clear the input
    } catch (error) {
      const errorAnswer = "❌ Failed to get response. Please try again.";
      const responseTime = Date.now() - startTime;
      
      setAnswer(errorAnswer);
      
      // Track error interaction
      trackAIInteraction({
        question,
        questionCategory: getQuestionCategory(question),
        responseTime,
        responseLength: errorAnswer.length,
        sourcesCount: 0,
        errorOccurred: true,
        errorType: 'network_error'
      });
      
      setConversationHistory(prev => [
        { question, answer: errorAnswer, timestamp: new Date(), category: getQuestionCategory(question) },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to categorize questions
  const getQuestionCategory = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('training') || lowerQuestion.includes('fitness') || lowerQuestion.includes('exercise')) return 'training';
    if (lowerQuestion.includes('gear') || lowerQuestion.includes('equipment') || lowerQuestion.includes('boot')) return 'gear';
    if (lowerQuestion.includes('everest') || lowerQuestion.includes('k2') || lowerQuestion.includes('summit') || lowerQuestion.includes('expedition')) return 'expeditions';
    if (lowerQuestion.includes('altitude') || lowerQuestion.includes('acclimatization') || lowerQuestion.includes('health')) return 'health';
    return 'general';
  };

  const handleQuickQuestion = (quickQuestion: string) => {
    setQuestion(quickQuestion);
  };

  // Filter conversation history based on selected filters
  const filteredHistory = conversationHistory.filter(conversation => {
    // Category filter
    if (selectedCategory !== 'all' && conversation.category !== selectedCategory) {
      return false;
    }

    // Time filter
    if (selectedTimeFilter !== 'all') {
      const now = new Date();
      const conversationDate = conversation.timestamp;
      
      switch (selectedTimeFilter) {
        case 'today':
          return conversationDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return conversationDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return conversationDate >= monthAgo;
      }
    }
    
    return true;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTimeFilter('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedTimeFilter !== 'all';

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
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-alpineBlue/10 border border-alpineBlue/20 rounded-full px-4 py-2 text-sm text-alpineBlue mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <SparklesIcon className="w-4 h-4" />
              AI-Powered Assistant
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ask the <span className="text-summitGold">Mountain</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12">
              Get instant answers about expeditions, training techniques, gear recommendations, 
              and mountaineering wisdom powered by AI.
            </p>

            {/* Main Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <form onSubmit={handleAsk} className="relative">
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask about training, gear, expeditions, or anything mountaineering..."
                        className="w-full bg-transparent text-white placeholder-white/50 text-lg focus:outline-none resize-none"
                        disabled={loading}
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading || !question.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-summitGold text-black rounded-2xl hover:bg-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <BoltIcon className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-white/60 mb-6"
                  >
                    <span className="inline-flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        🤖
                      </motion.div>
                      The Mountain is thinking...
                    </span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </motion.div>

          {/* Quick Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Popular Questions</h3>
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {popularQuestions.map((item, index) => (
                <motion.button
                  key={item.question}
                  onClick={() => handleQuickQuestion(item.question)}
                  whileHover={{ scale: 1.02 }}
                  className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-alpineBlue/20 to-glacierBlue/20 rounded-xl">
                      <item.icon className="w-5 h-5 text-alpineBlue" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1 group-hover:text-summitGold transition-colors">
                        {item.question}
                      </div>
                      <div className="text-xs text-white/50">{item.category}</div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-white/30 group-hover:text-summitGold group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Current Answer Display */}
      {answer && (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-alpineBlue/10 to-glacierBlue/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-alpineBlue to-glacierBlue rounded-2xl">
                  <ComputerDesktopIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-4">Mountain Guide Response</h3>
                  <div className="text-white/80 leading-relaxed whitespace-pre-line">
                    {answer}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <section className="py-16 bg-black">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h3 className="text-2xl font-bold text-white">Recent Conversations</h3>
              
              {/* Filter Toggle */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  hasActiveFilters || showFilters
                    ? 'bg-summitGold text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FunnelIcon className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-black/20 text-xs px-2 py-1 rounded-full">
                    {Object.values({selectedCategory, selectedTimeFilter}).filter(v => v !== 'all').length}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Filter */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TagIcon className="w-4 h-4 text-white/60" />
                      <span className="text-sm font-medium text-white/80">Category</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <motion.button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
                              selectedCategory === category.id
                                ? 'bg-alpineBlue text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {category.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Filter */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarDaysIcon className="w-4 h-4 text-white/60" />
                      <span className="text-sm font-medium text-white/80">Time Period</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {timeFilters.map((filter) => (
                        <motion.button
                          key={filter.id}
                          onClick={() => setSelectedTimeFilter(filter.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
                            selectedTimeFilter === filter.id
                              ? 'bg-alpineBlue text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {filter.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end mt-4">
                    <motion.button
                      onClick={clearFilters}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Clear filters
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
            {/* Results Info */}
            {showFilters && hasActiveFilters && (
              <div className="mb-6 text-white/60 text-sm">
                Showing {filteredHistory.length} of {conversationHistory.length} conversations
              </div>
            )}

            <div className="space-y-6">
              {(hasActiveFilters ? filteredHistory : conversationHistory).slice(0, 10).map((conversation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6"
                >
                  {/* Question */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-gradient-to-br from-summitGold/20 to-yellow-500/20 rounded-xl">
                      <UserIcon className="w-5 h-5 text-summitGold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-white font-medium flex-1">{conversation.question}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          conversation.category === 'training' ? 'bg-blue-500/20 text-blue-400' :
                          conversation.category === 'gear' ? 'bg-green-500/20 text-green-400' :
                          conversation.category === 'expeditions' ? 'bg-purple-500/20 text-purple-400' :
                          conversation.category === 'health' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {categories.find(c => c.id === conversation.category)?.label || 'General'}
                        </div>
                      </div>
                      <div className="text-xs text-white/50">
                        {conversation.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Answer */}
                  <div className="flex items-start gap-4 pl-4 border-l-2 border-alpineBlue/30">
                    <div className="p-2 bg-gradient-to-br from-alpineBlue/20 to-glacierBlue/20 rounded-xl">
                      <ComputerDesktopIcon className="w-5 h-5 text-alpineBlue" />
                    </div>
                    <div className="flex-1 text-white/70 text-sm leading-relaxed">
                      {conversation.answer}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}