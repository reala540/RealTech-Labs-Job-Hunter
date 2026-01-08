import { Job, Resume, MatchResult, JobFilter, ApplicationState } from '@/types';
import { adapterRegistry } from '@/adapters/adapter-registry';
import { matchJobsToResume, generateEmbedding } from './matching-engine';

/**
 * Job Store
 * 
 * In-memory store for managing jobs, resumes, and match results.
 * Provides persistence via localStorage for client-side storage.
 */
class JobStore {
  private state: ApplicationState = {
    resume: null,
    jobs: [],
    matchResults: [],
    filters: {},
    savedJobs: [],
    appliedJobs: [],
    searchHistory: [],
    isLoading: false,
    error: null,
  };
  
  private listeners: Set<(state: ApplicationState) => void> = new Set();
  private storageKey = 'realtech-job-hunter-state';
  
  constructor() {
    this.loadFromStorage();
  }
  
  // State management
  getState(): ApplicationState {
    return { ...this.state };
  }
  
  private setState(updates: Partial<ApplicationState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveToStorage();
  }
  
  subscribe(listener: (state: ApplicationState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }
  
  // Storage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = {
          ...this.state,
          resume: parsed.resume || null,
          savedJobs: parsed.savedJobs || [],
          appliedJobs: parsed.appliedJobs || [],
          searchHistory: parsed.searchHistory || [],
          filters: parsed.filters || {},
        };
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }
  
  private saveToStorage(): void {
    try {
      const toStore = {
        resume: this.state.resume,
        savedJobs: this.state.savedJobs,
        appliedJobs: this.state.appliedJobs,
        searchHistory: this.state.searchHistory,
        filters: this.state.filters,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }
  
  // Resume management
  setResume(resume: Resume): void {
    // Generate embedding for the resume
    const embedding = generateEmbedding(
      resume.rawText + ' ' + resume.skills.join(' ')
    );
    
    this.setState({
      resume: { ...resume, embedding },
      matchResults: [], // Clear previous matches
    });
  }
  
  clearResume(): void {
    this.setState({
      resume: null,
      matchResults: [],
    });
  }
  
  getResume(): Resume | null {
    return this.state.resume;
  }
  
  // Job management
  async fetchJobs(query: string = '', filters?: Partial<JobFilter>): Promise<void> {
    this.setState({ isLoading: true, error: null });
    
    try {
      const mergedFilters = { ...this.state.filters, ...filters };
      const jobs = await adapterRegistry.fetchAllJobs(query, mergedFilters);
      
      // Generate embeddings for jobs
      const jobsWithEmbeddings = jobs.map(job => ({
        ...job,
        embedding: generateEmbedding(
          job.title + ' ' + job.description + ' ' + job.skills.join(' ')
        ),
      }));
      
      // Calculate matches if resume exists
      let matchResults: MatchResult[] = [];
      if (this.state.resume) {
        matchResults = matchJobsToResume(this.state.resume, jobsWithEmbeddings);
      }
      
      // Update search history
      const searchHistory = query && !this.state.searchHistory.includes(query)
        ? [query, ...this.state.searchHistory.slice(0, 9)]
        : this.state.searchHistory;
      
      this.setState({
        jobs: jobsWithEmbeddings,
        matchResults,
        filters: mergedFilters,
        searchHistory,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      });
    }
  }
  
  async getJobById(id: string): Promise<Job | null> {
    // Check local cache first
    const cachedJob = this.state.jobs.find(job => job.id === id);
    if (cachedJob) return cachedJob;
    
    // Fetch from adapters
    return adapterRegistry.getJobById(id);
  }
  
  getJobs(): Job[] {
    return this.state.jobs;
  }
  
  getMatchResults(): MatchResult[] {
    return this.state.matchResults;
  }
  
  // Filter management
  setFilters(filters: Partial<JobFilter>): void {
    this.setState({ filters: { ...this.state.filters, ...filters } });
  }
  
  clearFilters(): void {
    this.setState({ filters: {} });
  }
  
  getFilters(): JobFilter {
    return this.state.filters;
  }
  
  // Apply filters to current results
  applyFilters(filters: Partial<JobFilter>): MatchResult[] {
    const mergedFilters = { ...this.state.filters, ...filters };
    
    return this.state.matchResults.filter(result => {
      const job = result.job;
      
      // Min match score filter
      if (mergedFilters.minMatchScore !== undefined) {
        if (result.score < mergedFilters.minMatchScore) return false;
      }
      
      // Role filter
      if (mergedFilters.roles && mergedFilters.roles.length > 0) {
        const titleLower = job.title.toLowerCase();
        const matchesRole = mergedFilters.roles.some(role => 
          titleLower.includes(role.toLowerCase())
        );
        if (!matchesRole) return false;
      }
      
      // Location filter
      if (mergedFilters.locations && mergedFilters.locations.length > 0) {
        const locationLower = job.location.toLowerCase();
        const matchesLocation = mergedFilters.locations.some(loc => 
          locationLower.includes(loc.toLowerCase())
        );
        if (!matchesLocation) return false;
      }
      
      // Location type filter
      if (mergedFilters.locationType && mergedFilters.locationType.length > 0) {
        if (!mergedFilters.locationType.includes(job.locationType)) return false;
      }
      
      // Salary filter
      if (mergedFilters.salaryMin !== undefined && job.salary?.max) {
        if (job.salary.max < mergedFilters.salaryMin) return false;
      }
      if (mergedFilters.salaryMax !== undefined && job.salary?.min) {
        if (job.salary.min > mergedFilters.salaryMax) return false;
      }
      
      // Seniority filter
      if (mergedFilters.seniority && mergedFilters.seniority.length > 0) {
        if (!mergedFilters.seniority.includes(job.seniority)) return false;
      }
      
      // Job type filter
      if (mergedFilters.jobType && mergedFilters.jobType.length > 0) {
        if (!mergedFilters.jobType.includes(job.jobType)) return false;
      }
      
      // Company filter
      if (mergedFilters.companies && mergedFilters.companies.length > 0) {
        const companyLower = job.company.toLowerCase();
        const matchesCompany = mergedFilters.companies.some(company => 
          companyLower.includes(company.toLowerCase())
        );
        if (!matchesCompany) return false;
      }
      
      // Keywords filter
      if (mergedFilters.keywords && mergedFilters.keywords.length > 0) {
        const jobText = `${job.title} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
        const matchesKeyword = mergedFilters.keywords.some(keyword => 
          jobText.includes(keyword.toLowerCase())
        );
        if (!matchesKeyword) return false;
      }
      
      // Source filter
      if (mergedFilters.sources && mergedFilters.sources.length > 0) {
        if (!mergedFilters.sources.includes(job.source)) return false;
      }
      
      // Posted within filter
      if (mergedFilters.postedWithin && mergedFilters.postedWithin !== 'all') {
        const postedDate = new Date(job.postedDate);
        const now = new Date();
        const diffDays = (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (mergedFilters.postedWithin) {
          case '24h':
            if (diffDays > 1) return false;
            break;
          case '7d':
            if (diffDays > 7) return false;
            break;
          case '30d':
            if (diffDays > 30) return false;
            break;
        }
      }
      
      return true;
    });
  }
  
  // Saved jobs management
  saveJob(jobId: string): void {
    if (!this.state.savedJobs.includes(jobId)) {
      this.setState({
        savedJobs: [...this.state.savedJobs, jobId],
      });
    }
  }
  
  unsaveJob(jobId: string): void {
    this.setState({
      savedJobs: this.state.savedJobs.filter(id => id !== jobId),
    });
  }
  
  isJobSaved(jobId: string): boolean {
    return this.state.savedJobs.includes(jobId);
  }
  
  getSavedJobs(): string[] {
    return this.state.savedJobs;
  }
  
  // Applied jobs management
  markAsApplied(jobId: string): void {
    if (!this.state.appliedJobs.includes(jobId)) {
      this.setState({
        appliedJobs: [...this.state.appliedJobs, jobId],
      });
    }
  }
  
  isJobApplied(jobId: string): boolean {
    return this.state.appliedJobs.includes(jobId);
  }
  
  getAppliedJobs(): string[] {
    return this.state.appliedJobs;
  }
  
  // Search history
  getSearchHistory(): string[] {
    return this.state.searchHistory;
  }
  
  clearSearchHistory(): void {
    this.setState({ searchHistory: [] });
  }
  
  // Loading state
  isLoading(): boolean {
    return this.state.isLoading;
  }
  
  getError(): string | null {
    return this.state.error;
  }
  
  clearError(): void {
    this.setState({ error: null });
  }
}

// Export singleton instance
export const jobStore = new JobStore();
