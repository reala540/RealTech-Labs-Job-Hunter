import { Job, JobFilter, JobSourceAdapter } from '@/types';
import { linkedInAdapter } from './linkedin-adapter';
import { indeedAdapter } from './indeed-adapter';
import { glassdoorAdapter } from './glassdoor-adapter';
import { remoteOKAdapter } from './remoteok-adapter';
import { companyPagesAdapter } from './company-adapter';

/**
 * Adapter Registry
 * 
 * Central registry for managing all job source adapters.
 * Provides unified interface for fetching jobs from multiple sources.
 */
class AdapterRegistry {
  private adapters: Map<string, JobSourceAdapter> = new Map();
  
  constructor() {
    // Register all adapters
    this.registerAdapter(linkedInAdapter);
    this.registerAdapter(indeedAdapter);
    this.registerAdapter(glassdoorAdapter);
    this.registerAdapter(remoteOKAdapter);
    this.registerAdapter(companyPagesAdapter);
  }
  
  registerAdapter(adapter: JobSourceAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }
  
  unregisterAdapter(name: string): void {
    this.adapters.delete(name);
  }
  
  getAdapter(name: string): JobSourceAdapter | undefined {
    return this.adapters.get(name);
  }
  
  getAllAdapters(): JobSourceAdapter[] {
    return Array.from(this.adapters.values());
  }
  
  getEnabledAdapters(): JobSourceAdapter[] {
    return this.getAllAdapters().filter(adapter => adapter.enabled);
  }
  
  getAdapterNames(): string[] {
    return Array.from(this.adapters.keys());
  }
  
  /**
   * Fetch jobs from all enabled adapters
   */
  async fetchAllJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    const enabledAdapters = this.getEnabledAdapters();
    
    // Filter by source if specified
    const adaptersToUse = filters?.sources && filters.sources.length > 0
      ? enabledAdapters.filter(adapter => filters.sources!.includes(adapter.name))
      : enabledAdapters;
    
    // Fetch from all adapters in parallel
    const results = await Promise.allSettled(
      adaptersToUse.map(adapter => adapter.fetchJobs(query, filters))
    );
    
    // Combine results
    const allJobs: Job[] = [];
    
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allJobs.push(...result.value);
      } else {
        console.error('Adapter fetch failed:', result.reason);
      }
    }
    
    // Remove duplicates based on title + company
    const seen = new Set<string>();
    const uniqueJobs = allJobs.filter(job => {
      const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Sort by posted date (newest first)
    uniqueJobs.sort((a, b) => 
      new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    );
    
    return uniqueJobs;
  }
  
  /**
   * Fetch a specific job by ID from all adapters
   */
  async getJobById(id: string): Promise<Job | null> {
    for (const adapter of this.getEnabledAdapters()) {
      const job = await adapter.getJobById(id);
      if (job) return job;
    }
    return null;
  }
  
  /**
   * Get adapter statistics
   */
  getStats(): { name: string; enabled: boolean; isRestricted: boolean }[] {
    return this.getAllAdapters().map(adapter => ({
      name: adapter.name,
      enabled: adapter.enabled,
      isRestricted: adapter.isRestricted,
    }));
  }
}

// Export singleton instance
export const adapterRegistry = new AdapterRegistry();

// Export individual adapters for direct access if needed
export {
  linkedInAdapter,
  indeedAdapter,
  glassdoorAdapter,
  remoteOKAdapter,
  companyPagesAdapter,
};
