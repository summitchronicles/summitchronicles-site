'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

interface UploadResult {
  success: boolean;
  planId?: string;
  title?: string;
  weekNumber?: number;
  strengthDays?: number;
  cardioDays?: number;
  guidelines?: number;
  error?: string;
}

export default function TrainingUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      setResult({
        success: false,
        error: 'Please upload an Excel file (.xlsx)',
      });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('startDate', startDate);

      const response = await fetch('/api/training/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Upload failed. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Navigation */}
        <Link
          href="/training"
          className="inline-flex items-center gap-2 text-white/70 hover:text-summitGold transition-colors duration-300 mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Training
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upload Training Plan
          </h1>
          <p className="text-xl text-white/70">
            Upload your weekly training Excel file to start tracking
          </p>
        </motion.div>

        {/* Start Date Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <label className="block text-white/80 text-sm font-medium mb-3">
            Training Week Start Date
          </label>
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="w-5 h-5 text-summitGold" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
            />
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            className={`
              relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300
              ${
                dragActive
                  ? 'border-summitGold bg-summitGold/10'
                  : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-summitGold/20 rounded-full flex items-center justify-center">
                <ArrowUpTrayIcon className="w-8 h-8 text-summitGold" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {uploading ? 'Processing...' : 'Drop your Excel file here'}
                </h3>
                <p className="text-white/60">
                  {uploading
                    ? 'Parsing training plan...'
                    : 'or click to browse files'}
                </p>
              </div>

              <div className="text-sm text-white/50">
                Supports: .xlsx files with the standard training plan format
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              rounded-2xl border p-6 mb-8
              ${
                result.success
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              }
            `}
          >
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              )}

              <div className="flex-1">
                {result.success ? (
                  <div>
                    <h3 className="text-lg font-semibold text-green-400 mb-2">
                      Training Plan Uploaded Successfully!
                    </h3>
                    <div className="space-y-2 text-white/80">
                      <p>
                        <strong>Title:</strong> {result.title}
                      </p>
                      {result.weekNumber && (
                        <p>
                          <strong>Week:</strong> {result.weekNumber}
                        </p>
                      )}
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <strong>Strength Days:</strong> {result.strengthDays}
                        </div>
                        <div>
                          <strong>Cardio Days:</strong> {result.cardioDays}
                        </div>
                        <div>
                          <strong>Guidelines:</strong> {result.guidelines}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Link
                        href={`/training/plans?id=${result.planId}`}
                        className="px-6 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                      >
                        View Plan Details
                      </Link>
                      <Link
                        href="/training/workout"
                        className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
                      >
                        Start Today's Workout
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Upload Failed
                    </h3>
                    <p className="text-white/80">{result.error}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <DocumentTextIcon className="w-6 h-6 text-summitGold flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Excel File Requirements
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>
                  • <strong>Sheet 1:</strong> "Sunith's WP" - Strength training
                  with exercises, sets, reps, RPE
                </li>
                <li>
                  • <strong>Sheet 2:</strong> "Week Plan" - Cardio sessions with
                  duration, pace, HR zones
                </li>
                <li>
                  • <strong>Sheet 3:</strong> "Fuel & Safeguards" - Training
                  guidelines and protocols
                </li>
                <li>• File format: .xlsx (Excel format)</li>
                <li>• Date format: Sep-08, Sep-09, etc.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
