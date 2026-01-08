import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { JobFilter } from '@/types';

interface JobFiltersProps {
  filters: JobFilter;
  onFiltersChange: (filters: Partial<JobFilter>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['locationType', 'seniority']);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  const locationTypes = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'onsite', label: 'On-site' },
  ] as const;
  
  const seniorityLevels = [
    { value: 'intern', label: 'Intern' },
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
  ] as const;
  
  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
  ] as const;
  
  const postedWithinOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'all', label: 'All time' },
  ] as const;
  
  const sources = ['LinkedIn', 'Indeed', 'Glassdoor', 'RemoteOK', 'Company Pages'];
  
  const hasActiveFilters = Object.values(filters).some(v => 
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );
  
  const FilterSection: React.FC<{
    title: string;
    id: string;
    children: React.ReactNode;
  }> = ({ title, id, children }) => {
    const isExpanded = expandedSections.includes(id);
    
    return (
      <div className="border-b border-slate-700/50 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between py-3 text-left"
        >
          <span className="text-sm font-medium text-white">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>
        {isExpanded && <div className="pb-4">{children}</div>}
      </div>
    );
  };
  
  const CheckboxGroup: React.FC<{
    options: readonly { value: string; label: string }[];
    selected: string[];
    onChange: (values: string[]) => void;
  }> = ({ options, selected, onChange }) => (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selected, option.value]);
              } else {
                onChange(selected.filter(v => v !== option.value));
              }
            }}
            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-800"
          />
          <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
  
  const filtersContent = (
    <div className="space-y-1">
      {/* Match Score */}
      <FilterSection title="Minimum Match Score" id="matchScore">
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minMatchScore || 0}
            onChange={(e) => onFiltersChange({ minMatchScore: parseInt(e.target.value) || undefined })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>0%</span>
            <span className="text-violet-400 font-medium">{filters.minMatchScore || 0}%</span>
            <span>100%</span>
          </div>
        </div>
      </FilterSection>
      
      {/* Location Type */}
      <FilterSection title="Work Location" id="locationType">
        <CheckboxGroup
          options={locationTypes}
          selected={filters.locationType || []}
          onChange={(values) => onFiltersChange({ locationType: values as JobFilter['locationType'] })}
        />
      </FilterSection>
      
      {/* Seniority */}
      <FilterSection title="Experience Level" id="seniority">
        <CheckboxGroup
          options={seniorityLevels}
          selected={filters.seniority || []}
          onChange={(values) => onFiltersChange({ seniority: values as JobFilter['seniority'] })}
        />
      </FilterSection>
      
      {/* Job Type */}
      <FilterSection title="Job Type" id="jobType">
        <CheckboxGroup
          options={jobTypes}
          selected={filters.jobType || []}
          onChange={(values) => onFiltersChange({ jobType: values as JobFilter['jobType'] })}
        />
      </FilterSection>
      
      {/* Salary Range */}
      <FilterSection title="Salary Range" id="salary">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Minimum ($)</label>
            <input
              type="number"
              placeholder="e.g., 80000"
              value={filters.salaryMin || ''}
              onChange={(e) => onFiltersChange({ salaryMin: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Maximum ($)</label>
            <input
              type="number"
              placeholder="e.g., 200000"
              value={filters.salaryMax || ''}
              onChange={(e) => onFiltersChange({ salaryMax: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </FilterSection>
      
      {/* Posted Within */}
      <FilterSection title="Posted Within" id="postedWithin">
        <div className="space-y-2">
          {postedWithinOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="postedWithin"
                checked={filters.postedWithin === option.value}
                onChange={() => onFiltersChange({ postedWithin: option.value })}
                className="w-4 h-4 border-slate-600 bg-slate-700 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-800"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
      
      {/* Sources */}
      <FilterSection title="Job Sources" id="sources">
        <CheckboxGroup
          options={sources.map(s => ({ value: s, label: s }))}
          selected={filters.sources || []}
          onChange={(values) => onFiltersChange({ sources: values })}
        />
      </FilterSection>
      
      {/* Keywords */}
      <FilterSection title="Keywords" id="keywords">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Add keyword and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value.trim();
                if (value && !filters.keywords?.includes(value)) {
                  onFiltersChange({ keywords: [...(filters.keywords || []), value] });
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
          {filters.keywords && filters.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {filters.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-500/20 text-violet-400 text-xs"
                >
                  {keyword}
                  <button
                    onClick={() => onFiltersChange({ 
                      keywords: filters.keywords?.filter(k => k !== keyword) 
                    })}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </FilterSection>
    </div>
  );
  
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
        >
          <Filter className="w-5 h-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-violet-500 text-xs">Active</span>
          )}
        </button>
      </div>
      
      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/95 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {filtersContent}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  onClearFilters();
                  setMobileFiltersOpen(false);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-violet-500 text-white font-medium"
              >
                Show {resultCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Filters */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold text-white">Filters</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          
          <div className="text-sm text-slate-400 mb-4">
            {resultCount} job{resultCount !== 1 ? 's' : ''} found
          </div>
          
          {filtersContent}
        </div>
      </div>
    </>
  );
};
