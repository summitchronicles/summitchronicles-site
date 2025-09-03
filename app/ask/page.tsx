"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
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
  Cog6ToothIcon
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

export default function AskPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string, answer: string, timestamp: Date}>>([]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setLoading(true);
    setAnswer("");
    
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: question }),
      });
      
      const data = await response.json();
      
      const newAnswer = data.error ? "❌ " + data.error : (data.answer || "No answer received.");
      setAnswer(newAnswer);
      
      // Add to conversation history
      setConversationHistory(prev => [
        { question, answer: newAnswer, timestamp: new Date() },
        ...prev
      ]);
      
      setQuestion(""); // Clear the input
    } catch (error) {
      const errorAnswer = "❌ Failed to get response. Please try again.";
      setAnswer(errorAnswer);
      setConversationHistory(prev => [
        { question, answer: errorAnswer, timestamp: new Date() },
        ...prev
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (quickQuestion: string) => {
    setQuestion(quickQuestion);
  };

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
            <h3 className="text-2xl font-bold text-white mb-8">Recent Conversations</h3>
            <div className="space-y-6">
              {conversationHistory.slice(0, 3).map((conversation, index) => (
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
                      <div className="text-white font-medium">{conversation.question}</div>
                      <div className="text-xs text-white/50 mt-1">
                        {conversation.timestamp.toLocaleTimeString()}
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