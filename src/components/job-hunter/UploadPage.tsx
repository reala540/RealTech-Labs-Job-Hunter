import React from 'react';
import { ArrowRight, FileText, Sparkles, CheckCircle } from 'lucide-react';
import { ResumeUploader } from './ResumeUploader';
import { Resume } from '@/types';

interface UploadPageProps {
  onResumeReady: (resume: Resume) => void;
  existingResume: Resume | null;
  onClearResume: () => void;
  onContinue: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  onResumeReady,
  existingResume,
  onClearResume,
  onContinue,
}) => {
  const tips = [
    'Include relevant keywords from job descriptions you\'re targeting',
    'Quantify achievements with numbers and metrics when possible',
    'Keep formatting simple - our parser works best with clean text',
    'Include a skills section with technical and soft skills',
    'List experience in reverse chronological order',
  ];
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-6">
            <FileText className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Step 1 of 2</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Upload Your Resume
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Our AI will analyze your resume to extract skills, experience, and qualifications 
            for personalized job matching.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2">
            <ResumeUploader
              onResumeReady={onResumeReady}
              existingResume={existingResume}
              onClearResume={onClearResume}
            />
            
            {/* Continue Button */}
            {existingResume && (
              <button
                onClick={onContinue}
                className="w-full mt-6 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-lg hover:from-violet-600 hover:to-indigo-700 transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center justify-center gap-2 group"
              >
                Continue to Job Search
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* What We Extract */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold text-white">What We Extract</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Contact Information',
                  'Technical & Soft Skills',
                  'Work Experience',
                  'Education & Certifications',
                  'Key Achievements',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resume Tips */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h3 className="font-semibold text-white mb-4">Resume Tips</h3>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-400">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Privacy Notice */}
            <div className="bg-emerald-500/10 rounded-2xl border border-emerald-500/20 p-6">
              <h3 className="font-semibold text-emerald-400 mb-2">Your Privacy Matters</h3>
              <p className="text-sm text-slate-400">
                All resume processing happens locally in your browser. Your data is never uploaded 
                to any server or stored in the cloud. You have complete control over your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
