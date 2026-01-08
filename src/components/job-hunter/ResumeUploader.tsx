import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parseResume, parseResumeFile } from '@/lib/resume-parser';
import { Resume, ParsingProgress } from '@/types';

interface ResumeUploaderProps {
  onResumeReady: (resume: Resume) => void;
  existingResume: Resume | null;
  onClearResume: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onResumeReady,
  existingResume,
  onClearResume,
}) => {
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [progress, setProgress] = useState<ParsingProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = async (file: File) => {
    setError(null);
    setProgress({ stage: 'uploading', progress: 0, message: 'Starting upload...' });
    
    try {
      const resume = await parseResumeFile(file, setProgress);
      onResumeReady(resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
      setProgress({ stage: 'error', progress: 0, message: 'Parsing failed' });
    }
  };
  
  const handlePaste = async () => {
    if (!pastedText.trim()) {
      setError('Please paste your resume text');
      return;
    }
    
    setError(null);
    setProgress({ stage: 'extracting', progress: 10, message: 'Processing text...' });
    
    try {
      const resume = await parseResume(pastedText, setProgress);
      onResumeReady(resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
      setProgress({ stage: 'error', progress: 0, message: 'Parsing failed' });
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = () => {
    setDragActive(false);
  };
  
  const progressStages = ['uploading', 'extracting', 'parsing', 'analyzing', 'complete'];
  const currentStageIndex = progress ? progressStages.indexOf(progress.stage) : -1;
  
  // Show existing resume summary
  if (existingResume && progress?.stage === 'complete') {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Resume Parsed Successfully</h3>
              <p className="text-sm text-slate-400">Your resume is ready for job matching</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClearResume();
              setProgress(null);
              setPastedText('');
            }}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Resume Summary */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Name</p>
              <p className="text-white font-medium">{existingResume.name}</p>
            </div>
            {existingResume.email && (
              <div className="bg-slate-700/30 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Email</p>
                <p className="text-white font-medium truncate">{existingResume.email}</p>
              </div>
            )}
          </div>
          
          {/* Skills */}
          <div className="bg-slate-700/30 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
              Skills Detected ({existingResume.skills.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {existingResume.skills.slice(0, 12).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md bg-violet-500/20 text-violet-400 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {existingResume.skills.length > 12 && (
                <span className="px-2 py-1 text-slate-500 text-xs">
                  +{existingResume.skills.length - 12} more
                </span>
              )}
            </div>
          </div>
          
          {/* Experience */}
          {existingResume.experience.length > 0 && (
            <div className="bg-slate-700/30 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                Experience ({existingResume.experience.length} positions)
              </p>
              <div className="space-y-2">
                {existingResume.experience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-sm text-white">{exp.title}</span>
                    <span className="text-sm text-slate-500">at {exp.company}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Education */}
          {existingResume.education.length > 0 && (
            <div className="bg-slate-700/30 rounded-xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Education</p>
              <div className="space-y-2">
                {existingResume.education.map((edu, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-sm text-white">{edu.degree}</span>
                    <span className="text-sm text-slate-500">- {edu.institution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 p-1 bg-slate-700/50 rounded-xl mb-6">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-violet-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setMode('paste')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'paste'
              ? 'bg-violet-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Paste Text
        </button>
      </div>
      
      {/* Progress Indicator */}
      {progress && progress.stage !== 'error' && progress.stage !== 'complete' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">{progress.message}</span>
            <span className="text-sm text-violet-400">{progress.progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            {progressStages.slice(0, -1).map((stage, index) => (
              <div key={stage} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStageIndex
                      ? 'bg-violet-500'
                      : 'bg-slate-600'
                  }`}
                />
                {index < progressStages.length - 2 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 ${
                      index < currentStageIndex
                        ? 'bg-violet-500'
                        : 'bg-slate-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium">Error parsing resume</p>
            <p className="text-red-400/80 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {mode === 'upload' ? (
        /* File Upload */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${dragActive
              ? 'border-violet-500 bg-violet-500/10'
              : 'border-slate-600 hover:border-slate-500'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
          
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            {progress && progress.stage !== 'error' && progress.stage !== 'complete' ? (
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400" />
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            {dragActive ? 'Drop your resume here' : 'Upload your resume'}
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Drag and drop or click to browse
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={progress?.stage !== 'error' && progress?.stage !== 'complete' && progress !== null}
            className="px-6 py-2.5 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose File
          </button>
          
          <p className="text-slate-500 text-xs mt-4">
            Supported formats: PDF, DOCX, TXT
          </p>
        </div>
      ) : (
        /* Text Paste */
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {pastedText.length} characters
            </div>
          </div>
          
          <button
            onClick={handlePaste}
            disabled={!pastedText.trim() || (progress?.stage !== 'error' && progress?.stage !== 'complete' && progress !== null)}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {progress && progress.stage !== 'error' && progress.stage !== 'complete' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Parse Resume
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
