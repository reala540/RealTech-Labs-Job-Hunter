import React from 'react';
import { MatchResult } from '@/types';
import { CheckCircle, XCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface MatchBreakdownProps {
  matchResult: MatchResult;
}

export const MatchBreakdown: React.FC<MatchBreakdownProps> = ({ matchResult }) => {
  const { breakdown, matchedSkills, missingSkills, experienceRelevance, recommendations } = matchResult;
  
  const breakdownItems = [
    { label: 'Skills Match', value: breakdown.skillsMatch, color: 'violet' },
    { label: 'Experience', value: breakdown.experienceMatch, color: 'indigo' },
    { label: 'Keywords', value: breakdown.keywordMatch, color: 'blue' },
    { label: 'Location', value: breakdown.locationMatch, color: 'cyan' },
    { label: 'Seniority', value: breakdown.seniorityMatch, color: 'emerald' },
  ];
  
  const getBarColor = (value: number) => {
    if (value >= 80) return 'from-emerald-500 to-green-500';
    if (value >= 60) return 'from-amber-500 to-yellow-500';
    if (value >= 40) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };
  
  return (
    <div className="space-y-6">
      {/* Score Breakdown */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Match Breakdown
        </h3>
        <div className="space-y-4">
          {breakdownItems.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.value}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getBarColor(item.value)} transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skills Analysis */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Skills Analysis</h3>
        
        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                Matching Skills ({matchedSkills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                Skills to Develop ({missingSkills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Experience Relevance */}
      <div className="bg-slate-800/50 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Experience Assessment</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{experienceRelevance}</p>
      </div>
      
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl p-5 border border-violet-500/20">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
