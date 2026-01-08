import React from 'react';
import { MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, ExternalLink, Building2, Briefcase } from 'lucide-react';
import { MatchResult } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  matchResult: MatchResult;
  isSaved: boolean;
  isApplied: boolean;
  onSave: () => void;
  onApply: () => void;
  onClick: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  matchResult,
  isSaved,
  isApplied,
  onSave,
  onApply,
  onClick,
}) => {
  const { job, score, matchedSkills, missingSkills } = matchResult;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-amber-500 to-yellow-500';
    if (score >= 40) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };
  
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
  
  const locationTypeColors = {
    remote: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hybrid: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    onsite: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  
  const postedTime = formatDistanceToNow(new Date(job.postedDate), { addSuffix: true });
  
  return (
    <div 
      className="group bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-violet-500/50 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-violet-500/10"
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Company Logo */}
            <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-7 h-7 text-slate-400" />
              )}
            </div>
            
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-slate-400 text-sm">{job.company}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-slate-500 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${locationTypeColors[job.locationType]}`}>
                  {job.locationType.charAt(0).toUpperCase() + job.locationType.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Match Score */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getScoreColor(score)} p-0.5`}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-lg font-bold text-white">{score}</span>
              </div>
            </div>
            <span className="text-xs text-slate-500 mt-1">{getScoreLabel(score)}</span>
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-4 flex-wrap text-sm">
          {formatSalary(job.salary) && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <DollarSign className="w-4 h-4" />
              {formatSalary(job.salary)}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-slate-400">
            <Briefcase className="w-4 h-4" />
            {job.seniority.charAt(0).toUpperCase() + job.seniority.slice(1)}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-4 h-4" />
            {postedTime}
          </span>
        </div>
      </div>
      
      {/* Skills */}
      <div className="px-5 pb-4">
        <div className="flex flex-wrap gap-1.5">
          {matchedSkills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium"
            >
              {skill.replace(' (related)', '')}
            </span>
          ))}
          {missingSkills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-md bg-slate-700/50 text-slate-400 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {(matchedSkills.length + missingSkills.length > 6) && (
            <span className="px-2 py-1 text-slate-500 text-xs">
              +{matchedSkills.length + missingSkills.length - 6} more
            </span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-5 py-4 bg-slate-800/30 border-t border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-violet-500/20 text-violet-400' 
                : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
          <span className="text-xs text-slate-500 px-2 py-1 rounded bg-slate-700/50">
            {job.source}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isApplied ? (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              Applied
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-medium hover:from-violet-600 hover:to-indigo-700 transition-all flex items-center gap-1.5"
            >
              Apply <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
