import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, RefreshCw, SlidersHorizontal, Grid, List } from 'lucide-react';
import { JobCard } from './JobCard';
import { JobFilters } from './JobFilters';
import { JobFilter, MatchResult, Resume } from '@/types';
import { useJobStore } from '@/hooks/useJobStore';

interface DashboardPageProps {
  resume: Resume;
  onJobClick: (jobId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ resume, onJobClick }) => {
  const {
    matchResults,
    filters,
    isLoading,
    error,
    fetchJobs,
    setFilters,
    clearFilters,
    applyFilters,
    saveJob,
    unsaveJob,
    isJobSaved,
    markAsApplied,
    isJobApplied,
    searchHistory,
  } = useJobStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState<MatchResult[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'salary'>('match');
  
  // Initial fetch
  useEffect(() => {
    if (matchResults.length === 0) {
      fetchJobs('');
    }
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let results = applyFilters(filters);
    
    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.score - a.score;
        case 'date':
          return new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime();
        case 'salary':
          const salaryA = a.job.salary?.max || a.job.salary?.min || 0;
          const salaryB = b.job.salary?.max || b.job.salary?.min || 0;
          return salaryB - salaryA;
        default:
          return 0;
      }
    });
    
    setFilteredResults(results);
  }, [matchResults, filters, sortBy, applyFilters]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchQuery, filters);
  };
  
  const handleFilterChange = (newFilters: Partial<JobFilter>) => {
    setFilters(newFilters);
  };
  
  const handleClearFilters = () => {
    clearFilters();
  };
  
  const handleRefresh = () => {
    fetchJobs(searchQuery, filters);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Job Matches for {resume.name}
              </h1>
              <p className="text-slate-400">
                {resume.skills.length} skills detected • {filteredResults.length} jobs matched
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
              >
                <option value="match">Sort by Match Score</option>
                <option value="date">Sort by Date Posted</option>
                <option value="salary">Sort by Salary</option>
              </select>
              
              <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-violet-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs by title, company, or skills..."
              className="w-full pl-12 pr-32 py-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-lg bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
          
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-slate-500">Recent:</span>
              {searchHistory.slice(0, 5).map((query) => (
                <button
                  key={query}
                  onClick={() => {
                    setSearchQuery(query);
                    fetchJobs(query, filters);
                  }}
                  className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs hover:text-white hover:bg-slate-700 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <JobFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredResults.length}
          />
          
          {/* Job Results */}
          <div className="flex-1 min-w-0">
            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">Error loading jobs</p>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isLoading && matchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
                <p className="text-slate-400">Searching for matching jobs...</p>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoading && filteredResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
                <p className="text-slate-400 max-w-md">
                  Try adjusting your filters or search query to find more matching jobs.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {/* Job Grid/List */}
            {filteredResults.length > 0 && (
              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 gap-4' 
                : 'space-y-4'
              }>
                {filteredResults.map((result) => (
                  <JobCard
                    key={result.job.id}
                    matchResult={result}
                    isSaved={isJobSaved(result.job.id)}
                    isApplied={isJobApplied(result.job.id)}
                    onSave={() => {
                      if (isJobSaved(result.job.id)) {
                        unsaveJob(result.job.id);
                      } else {
                        saveJob(result.job.id);
                      }
                    }}
                    onApply={() => {
                      markAsApplied(result.job.id);
                      if (result.job.applicationUrl) {
                        window.open(result.job.applicationUrl, '_blank');
                      }
                    }}
                    onClick={() => onJobClick(result.job.id)}
                  />
                ))}
              </div>
            )}
            
            {/* Loading More Indicator */}
            {isLoading && matchResults.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
