"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  ClipboardDocumentIcon,
  NewspaperIcon,
  CalendarIcon
} from "@heroicons/react/24/outline";

export default function NewsletterAdminPage() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(14);
  const [format, setFormat] = useState("markdown");
  const [metadata, setMetadata] = useState<any>(null);

  const generateDraft = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/newsletter/draft?days=${days}&format=${format}`);
      const data = await response.json();
      
      if (response.ok) {
        setDraft(data.draft);
        setMetadata(data);
      } else {
        alert('Error generating draft: ' + data.error);
      }
    } catch (error) {
      alert('Error generating draft');
      console.error('Draft generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      alert('Draft copied to clipboard! Now paste it into Buttondown.');
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-summitGold/10 backdrop-blur-sm border border-summitGold/30 rounded-2xl px-6 py-3 mb-6">
            <NewspaperIcon className="w-6 h-6 text-summitGold" />
            <span className="text-summitGold font-bold text-lg">Newsletter Admin</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Newsletter Draft Generator
          </h1>
          <p className="text-xl text-white/70">
            Generate newsletter drafts from recent blog posts, then copy to Buttondown
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-white/70" />
                <label className="text-white font-medium">Last</label>
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-summitGold/50"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={60}>60 days</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-5 h-5 text-white/70" />
                <label className="text-white font-medium">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-summitGold/50"
                >
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>

            <motion.button
              onClick={generateDraft}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-summitGold text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Draft'}
            </motion.button>
          </div>
        </motion.div>

        {/* Metadata */}
        {metadata && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-blue-400 font-medium">Posts found: </span>
                <span className="text-white">{metadata.posts_count}</span>
              </div>
              <div>
                <span className="text-blue-400 font-medium">Period: </span>
                <span className="text-white">Last {metadata.period_days} days</span>
              </div>
              {metadata.message && (
                <div>
                  <span className="text-blue-400 font-medium">Note: </span>
                  <span className="text-white">{metadata.message}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Draft Preview */}
        {draft && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Newsletter Draft</h3>
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors"
              >
                <ClipboardDocumentIcon className="w-4 h-4" />
                Copy to Clipboard
              </motion.button>
            </div>
            
            <div className="p-6">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={25}
                className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-summitGold/50 resize-y"
                placeholder="Your newsletter draft will appear here..."
              />
            </div>
            
            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="flex flex-col gap-4">
                <h4 className="text-lg font-bold text-white">Next Steps:</h4>
                <ol className="text-white/80 space-y-2 text-sm">
                  <li>1. <strong>Review & Edit:</strong> Customize the draft above with your personal updates</li>
                  <li>2. <strong>Copy Content:</strong> Use the &quot;Copy to Clipboard&quot; button</li>
                  <li>3. <strong>Go to Buttondown:</strong> Visit your <a href="https://buttondown.email/summitchronicles" target="_blank" rel="noopener noreferrer" className="text-summitGold hover:underline">Buttondown dashboard</a></li>
                  <li>4. <strong>Create New Email:</strong> Paste the content and review</li>
                  <li>5. <strong>Send to Subscribers:</strong> Schedule or send immediately</li>
                </ol>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        {!draft && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-summitGold mb-3">🔄 Auto-Collection</h4>
                <p className="text-white/80 text-sm">
                  Automatically pulls your recent blog posts and formats them into a newsletter template.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-summitGold mb-3">✏️ Review & Edit</h4>
                <p className="text-white/80 text-sm">
                  Add your personal expedition updates, training progress, and gear insights before sending.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-summitGold mb-3">📧 Easy Export</h4>
                <p className="text-white/80 text-sm">
                  Copy the formatted content directly to your Buttondown account for sending.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-summitGold mb-3">🎯 Personalized</h4>
                <p className="text-white/80 text-sm">
                  Each draft includes your voice and encourages subscriber engagement through questions.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}