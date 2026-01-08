import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Building2, Briefcase, 
  ExternalLink, Bookmark, BookmarkCheck, Share2, CheckCircle,
  Globe, Users, Calendar, Loader2
} from 'lucide-react';
import { Job, MatchResult, Resume } from '@/types';
import { MatchBreakdown } from './MatchBreakdown';
import { useJobStore } from '@/hooks/useJobStore';
import { calculateMatch } from '@/lib/matching-engine';
import { formatDistanceToNow } from 'date-fns';

interface JobDetailPageProps {
  jobId: string;
  resume: Resume;
  onBack: () => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({ jobId, resume, onBack }) => {
  const { getJobById, saveJob, unsaveJob, isJobSaved, markAsApplied, isJobApplied } = useJobStore();
  const [job, setJob] = useState<Job | null>(null);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'match'>('overview');
  
  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      const fetchedJob = await getJobById(jobId);
      if (fetchedJob) {
        setJob(fetchedJob);
        const match = calculateMatch(resume, fetchedJob);
        setMatchResult(match);
      }
      setLoading(false);
    };
    
    loadJob();
  }, [jobId, resume, getJobById]);
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
      </div>
    );
  }
  
  if (!job || !matchResult) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Job Not Found</h2>
          <p className="text-slate-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);
  const postedTime = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
  
  const formatSalary = (salary: typeof job.salary) => {
    if (!salary?.min && !salary?.max) return null;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      maximumFractionDigits: 0,
    });
    if (salary.min && salary.max) {
      return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
    }
    if (salary.min) return `From ${formatter.format(salary.min)}`;
    if (salary.max) return `Up to ${formatter.format(salary.max)}`;
    return null;
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    if (score >= 40) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };
  
  const locationTypeColors = {
    remote: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hybrid: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    onsite: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-start gap-4 mb-6">
                {/* Company Logo */}
                <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {job.companyLogo ? (
                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white mb-1">{job.title}</h1>
                  <p className="text-lg text-slate-400">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${locationTypeColors[job.locationType]}`}>
                      {job.locationType.charAt(0).toUpperCase() + job.locationType.slice(1)}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {postedTime}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-700/50">
                {formatSalary(job.salary) && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Salary</p>
                    <p className="text-emerald-400 font-medium">{formatSalary(job.salary)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Level</p>
                  <p className="text-white font-medium capitalize">{job.seniority}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
                  <p className="text-white font-medium capitalize">{job.jobType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Source</p>
                  <p className="text-white font-medium">{job.source}</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                {applied ? (
                  <div className="flex-1 px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium text-center flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Applied
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      markAsApplied(job.id);
                      if (job.applicationUrl) {
                        window.open(job.applicationUrl, '_blank');
                      }
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-medium hover:from-violet-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => saved ? unsaveJob(job.id) : saveJob(job.id)}
                  className={`p-3 rounded-xl transition-colors ${
                    saved 
                      ? 'bg-violet-500/20 text-violet-400' 
                      : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="p-3 rounded-xl bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-violet-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Job Overview
              </button>
              <button
                onClick={() => setActiveTab('match')}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'match'
                    ? 'bg-violet-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Match Analysis
              </button>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'overview' ? (
              <div className="space-y-6">
                {/* Description */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
                
                {/* Requirements */}
                {job.requirements.length > 0 && (
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Skills */}
                <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          resume.skills.some(s => s.toLowerCase() === skill.toLowerCase())
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Benefits</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {job.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-slate-300 text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MatchBreakdown matchResult={matchResult} />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Score Card */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 text-center">
              <p className="text-sm text-slate-400 mb-3">Your Match Score</p>
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getScoreColor(matchResult.score)} p-1 mx-auto`}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{matchResult.score}</span>
                </div>
              </div>
              <p className="text-white font-medium mt-3">
                {matchResult.score >= 80 ? 'Excellent Match' :
                 matchResult.score >= 60 ? 'Good Match' :
                 matchResult.score >= 40 ? 'Fair Match' : 'Low Match'}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {matchResult.matchedSkills.length} of {job.skills.length} skills matched
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Skills Match</span>
                  <span className="text-white font-medium">{matchResult.breakdown.skillsMatch}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Experience</span>
                  <span className="text-white font-medium">{matchResult.breakdown.experienceMatch}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Keywords</span>
                  <span className="text-white font-medium">{matchResult.breakdown.keywordMatch}%</span>
                </div>
              </div>
            </div>
            
            {/* Company Info */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
              <h3 className="font-semibold text-white mb-4">About {job.company}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300 text-sm">{job.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300 text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300 text-sm">{job.source}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
