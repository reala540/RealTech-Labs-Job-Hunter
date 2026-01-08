import { Job, JobFilter, JobSourceAdapter } from '@/types';

// Base adapter class with common functionality
export abstract class BaseJobAdapter implements JobSourceAdapter {
  abstract name: string;
  abstract enabled: boolean;
  abstract isRestricted: boolean;
  
  protected baseUrl: string = '';
  protected rateLimit: number = 1000; // ms between requests
  protected lastRequestTime: number = 0;
  
  // Rate limiting helper
  protected async rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimit) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimit - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
    return fetch(url, options);
  }
  
  // Abstract methods to be implemented by each adapter
  abstract fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]>;
  abstract getJobById(id: string): Promise<Job | null>;
  
  // Common filtering logic
  protected applyFilters(jobs: Job[], filters?: Partial<JobFilter>): Job[] {
    if (!filters) return jobs;
    
    return jobs.filter(job => {
      // Role/title filter
      if (filters.roles && filters.roles.length > 0) {
        const titleLower = job.title.toLowerCase();
        const matchesRole = filters.roles.some(role => 
          titleLower.includes(role.toLowerCase())
        );
        if (!matchesRole) return false;
      }
      
      // Location filter
      if (filters.locations && filters.locations.length > 0) {
        const locationLower = job.location.toLowerCase();
        const matchesLocation = filters.locations.some(loc => 
          locationLower.includes(loc.toLowerCase())
        );
        if (!matchesLocation) return false;
      }
      
      // Location type filter
      if (filters.locationType && filters.locationType.length > 0) {
        if (!filters.locationType.includes(job.locationType)) return false;
      }
      
      // Salary filter
      if (filters.salaryMin !== undefined && job.salary?.max) {
        if (job.salary.max < filters.salaryMin) return false;
      }
      if (filters.salaryMax !== undefined && job.salary?.min) {
        if (job.salary.min > filters.salaryMax) return false;
      }
      
      // Seniority filter
      if (filters.seniority && filters.seniority.length > 0) {
        if (!filters.seniority.includes(job.seniority)) return false;
      }
      
      // Job type filter
      if (filters.jobType && filters.jobType.length > 0) {
        if (!filters.jobType.includes(job.jobType)) return false;
      }
      
      // Company filter
      if (filters.companies && filters.companies.length > 0) {
        const companyLower = job.company.toLowerCase();
        const matchesCompany = filters.companies.some(company => 
          companyLower.includes(company.toLowerCase())
        );
        if (!matchesCompany) return false;
      }
      
      // Keywords filter
      if (filters.keywords && filters.keywords.length > 0) {
        const jobText = `${job.title} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
        const matchesKeyword = filters.keywords.some(keyword => 
          jobText.includes(keyword.toLowerCase())
        );
        if (!matchesKeyword) return false;
      }
      
      // Posted within filter
      if (filters.postedWithin && filters.postedWithin !== 'all') {
        const postedDate = new Date(job.postedDate);
        const now = new Date();
        const diffDays = (now.getTime() - postedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        switch (filters.postedWithin) {
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
  
  // Normalize job data to standard schema
  protected normalizeJob(rawJob: Record<string, unknown>, source: string): Partial<Job> {
    return {
      source,
      postedDate: new Date().toISOString(),
    };
  }
}

// Adapter configuration type
export interface AdapterConfig {
  enabled: boolean;
  apiKey?: string;
  rateLimit?: number;
  maxResults?: number;
}
