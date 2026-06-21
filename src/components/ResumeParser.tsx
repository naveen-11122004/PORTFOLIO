import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, AlertCircle, Check, FileText, Trash2, ArrowRight } from 'lucide-react';

interface UploadedResume {
  name: string;
  type: string;
  size: string;
  dataUrl: string;
  uploadedAt: string;
}

interface ResumeParserProps {
  onFileUploaded: (fileObj: UploadedResume) => void;
  onClose: () => void;
  uploadedResume: UploadedResume | null;
  onClearUploadedResume: () => void;
}

export default function ResumeParser({ onFileUploaded, onClose, uploadedResume, onClearUploadedResume }: ResumeParserProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    // Check sizes - support up to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Please select a resume file smaller than 10MB.");
      return;
    }

    setError(null);
    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const fileObj: UploadedResume = {
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(1) + " KB",
          dataUrl: result,
          uploadedAt: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        };
        
        // Brief simulated upload progress animation for sleek feedback
        setTimeout(() => {
          onFileUploaded(fileObj);
          setUploading(false);
        }, 600);
      } else {
        setUploading(false);
        setError("Failed to process file. Please try another document.");
      }
    };
    reader.onerror = () => {
      setUploading(false);
      setError("An error occurred while reading the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div id="resume-parser-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300">
      <div 
        id="resume-parser-modal"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-slate-900 border border-pink-500/30 shadow-2xl transition-all duration-300"
      >
        {/* Glow Header Accent Banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-white">Upload Your Private Resume</h3>
              <p className="text-xs text-slate-400 font-sans">Provide your custom PDF copy to link directly to visitors & viewers.</p>
            </div>
          </div>
          <button 
            id="close-parser-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            disabled={uploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {uploading ? (
            <div id="uploader-loading-state" className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                <FileText className="absolute w-5 h-5 text-pink-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Processing Document...</h4>
                <p className="text-xs text-slate-400">Storing local Base64 secure file buffer...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* If a custom file is already uploaded, show the option to update it or see details */}
              {uploadedResume ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-pink-500/10 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-lg bg-pink-500/5 border border-pink-500/20 text-pink-400 font-mono text-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{uploadedResume.name}</p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{uploadedResume.size}</span>
                          <span>•</span>
                          <span>Uploaded: {uploadedResume.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={onClearUploadedResume}
                      className="p-1 px-2 rounded-lg bg-red-950/20 hover:bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono transition-all flex items-center space-x-1 cursor-pointer"
                      title="Clear uploaded resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-mono font-medium pt-1.5 border-t border-slate-800/60">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>Active: This document replaces default portfolio resume views.</span>
                  </div>
                </div>
              ) : null}

              {/* Drag and Drop File Input Area */}
              <div
                id="file-dropzone"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`group relative flex flex-col items-center justify-center border-2 border-dashed p-8 rounded-xl cursor-pointer transition-all duration-300 ${
                  dragActive 
                  ? 'border-pink-500 bg-pink-500/5' 
                  : 'border-slate-800 hover:border-pink-500/40 bg-slate-950/40 hover:bg-slate-950/70'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,application/pdf,image/*,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                
                <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-pink-400 group-hover:border-pink-500/30 transition-all duration-300 mb-3 shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-200 text-center">
                  Drag & drop your PDF or copy here or <span className="text-pink-400 group-hover:underline">browse files</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5 font-mono text-center">
                  Supports PDF (.pdf), images (.png, .jpg), and Word documents
                </p>
              </div>

              {/* Guide actions info */}
              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl flex items-start space-x-2.5">
                <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Once your document is uploaded, visitors who click the resume button will see a gorgeous preview screen allowing them to print it, view it, or download it with clean speed.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-800/80">
                <button
                  id="parser-cancel-btn"
                  onClick={onClose}
                  className="px-4 py-2 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                {uploadedResume && (
                  <button
                    id="parser-submit-btn"
                    onClick={onClose}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 transition-all shadow-md cursor-pointer"
                  >
                    <span>View Resume Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
