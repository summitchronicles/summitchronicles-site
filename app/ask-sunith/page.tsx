"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  TrophyIcon,
  CogIcon,
  MapIcon,
  HeartIcon
} from "@heroicons/react/24/outline";

export default function AskSunithPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    "How do you train for high altitude?",
    "What gear is essential for Everest?",
    "How do you manage fear on difficult climbs?",
    "What's your typical training week look like?",
    "How do you choose climbing routes?",
    "What's the mental preparation like for Seven Summits?"
  ];

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    // Simulate API call - replace with actual AI integration
    setTimeout(() => {
      setResponse("Thanks for your question! This AI assistant is currently in development. I'm working on training it with insights from my actual expeditions, training data, and mountaineering experience. Check back soon for personalized advice based on my Seven Summits journey.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-8"
          >
            <SparklesIcon className="w-4 h-4 text-summitGold" />
            AI-Powered Mountaineering Advice
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ask{" "}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              Sunith
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12">
            Get personalized mountaineering advice based on my Seven Summits experience, 
            training methods, and expedition insights. Ask about gear, training, routes, or mental preparation.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-12"
          >
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Coming Soon!</h3>
                <p className="text-white/80 leading-relaxed">
                  I&apos;m currently training an AI assistant with insights from my expeditions, 
                  training data, gear reviews, and lessons learned on the mountains. It will provide 
                  personalized advice based on my actual Seven Summits experience.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Question Interface */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-summitGold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Ask Your Question</h2>
              <p className="text-white/60">
                What would you like to know about mountaineering, training, or expeditions?
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about training methods, gear recommendations, route planning, mental preparation, or any aspect of mountaineering..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 resize-none"
                />
              </div>

              <div className="text-center">
                <motion.button
                  onClick={handleAskQuestion}
                  disabled={isLoading || !question.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Thinking..." : "Ask Sunith"}
                </motion.button>
              </div>

              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/10 border border-white/20 rounded-xl p-6 mt-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-summitGold rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-black font-bold text-sm">S</span>
                    </div>
                    <div>
                      <p className="text-white/80 leading-relaxed">{response}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sample Questions */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Popular{" "}
              <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-white/70">
              Get inspired by what others are asking about mountaineering and expeditions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleQuestions.map((q, index) => (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setQuestion(q)}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <p className="text-white/80 font-medium">{q}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge Areas */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-6">What I Can Help With</h2>
            <p className="text-white/70">
              My AI assistant will be trained on these key areas of mountaineering expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrophyIcon,
                title: "Expedition Planning",
                topics: ["Route selection", "Timing & seasons", "Permit requirements", "Team building", "Risk assessment"]
              },
              {
                icon: HeartIcon,
                title: "Training Methods", 
                topics: ["Altitude preparation", "Strength training", "Endurance building", "Recovery protocols", "Injury prevention"]
              },
              {
                icon: CogIcon,
                title: "Gear & Equipment",
                topics: ["Essential gear lists", "Brand recommendations", "Gear testing", "Weight optimization", "Cold weather gear"]
              },
              {
                icon: MapIcon,
                title: "Mental Preparation",
                topics: ["Fear management", "Goal setting", "Motivation techniques", "Stress handling", "Decision making"]
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: "Seven Summits Specific",
                topics: ["Peak-specific advice", "Expedition logistics", "Training progressions", "Cost planning", "Timeline management"]
              },
              {
                icon: SparklesIcon,
                title: "Personal Experience",
                topics: ["Lessons learned", "Mistakes to avoid", "Success strategies", "Real expedition stories", "Honest insights"]
              }
            ].map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-summitGold/20 to-yellow-400/20">
                    <area.icon className="w-5 h-5 text-summitGold" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{area.title}</h3>
                </div>

                <ul className="space-y-2">
                  {area.topics.map((topic) => (
                    <li key={topic} className="text-sm text-white/70 flex items-center gap-2">
                      <div className="w-1 h-1 bg-summitGold rounded-full" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Want Personal Advice Now?
              </h3>
              <p className="text-lg text-white/70 mb-8">
                While I&apos;m building the AI assistant, you can always reach out directly 
                for specific questions about mountaineering, training, or expeditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Contact Directly
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
                >
                  Read Latest Insights
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}