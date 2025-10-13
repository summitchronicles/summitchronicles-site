'use client';

import { useState } from 'react';
import { Header } from '@/app/components/organisms/Header';
import { Upload, CheckCircle, XCircle, Loader2, FileSpreadsheet, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrainingUploadPage() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile && (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls'))) {
      setFile(selectedFile);
      setMessage(null);
    } else if (selectedFile) {
      setMessage({ type: 'error', text: 'Please select an Excel file (.xlsx or .xls)' });
    }
  };

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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('training_plan', file);
      formData.append('set_as_active', 'true');

      const response = await fetch('/api/training/upload-plan', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Training plan uploaded successfully! Week ${result.plan.week} starting ${result.plan.startDate}`
        });
        setFile(null);

        // Refresh the calendar after 2 seconds
        setTimeout(() => {
          window.location.href = '/training/realtime';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload file. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-light tracking-wide mb-4">Upload Training Plan</h1>
            <p className="text-gray-400 text-lg">
              Upload your weekly training plan Excel file to update your calendar
            </p>
          </motion.div>

          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-8"
          >
            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
                ${dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 hover:border-gray-600'
                }
                ${file ? 'bg-green-500/5 border-green-500/50' : ''}
              `}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileSpreadsheet className="w-16 h-16 text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-green-400 mb-1">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-gray-400 hover:text-white transition-colors underline"
                  >
                    Choose different file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Upload className="w-16 h-16 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-300 mb-2">
                      Drag and drop your Excel file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                        Browse Files
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: .xlsx, .xls
                  </p>
                </div>
              )}
            </div>

            {/* Upload Button */}
            {file && (
              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`
                    w-full py-4 rounded-lg font-medium text-lg transition-all duration-200
                    ${uploading
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Upload className="w-5 h-5" />
                      <span>Upload Training Plan</span>
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  mt-6 p-4 rounded-lg flex items-start space-x-3
                  ${message.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-red-500/20 border border-red-500/50'
                  }
                `}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <p className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                  {message.text}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-blue-300 font-medium mb-2">How it works</h3>
                <ul className="text-blue-200 text-sm space-y-2">
                  <li>1. Upload your training plan Excel file with the format: Date, Day, Session Title, Modality, Exercise, etc.</li>
                  <li>2. The file will be parsed and stored in Supabase</li>
                  <li>3. Your training calendar will automatically update</li>
                  <li>4. The uploaded plan will be immediately active on your website</li>
                  <li>5. No need to commit to git or redeploy!</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* View Calendar Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center"
          >
            <a
              href="/training/realtime"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>View Training Calendar</span>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
