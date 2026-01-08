import { useState, useEffect, useCallback } from 'react';
import { jobStore } from '@/lib/job-store';
import { ApplicationState, JobFilter, Resume, MatchResult, Job } from '@/types';

/**
 * Custom hook for accessing the job store
 */
export function useJobStore() {
  const [state, setState] = useState<ApplicationState>(jobStore.getState());
  
  useEffect(() => {
    const unsubscribe = jobStore.subscribe(setState);
    return unsubscribe;
  }, []);
  
  const fetchJobs = useCallback(async (query: string = '', filters?: Partial<JobFilter>) => {
    await jobStore.fetchJobs(query, filters);
  }, []);
  
  const setResume = useCallback((resume: Resume) => {
    jobStore.setResume(resume);
  }, []);
  
  const clearResume = useCallback(() => {
    jobStore.clearResume();
  }, []);
  
  const setFilters = useCallback((filters: Partial<JobFilter>) => {
    jobStore.setFilters(filters);
  }, []);
  
  const clearFilters = useCallback(() => {
    jobStore.clearFilters();
  }, []);
  
  const applyFilters = useCallback((filters: Partial<JobFilter>): MatchResult[] => {
    return jobStore.applyFilters(filters);
  }, []);
  
  const saveJob = useCallback((jobId: string) => {
    jobStore.saveJob(jobId);
  }, []);
  
  const unsaveJob = useCallback((jobId: string) => {
    jobStore.unsaveJob(jobId);
  }, []);
  
  const isJobSaved = useCallback((jobId: string): boolean => {
    return jobStore.isJobSaved(jobId);
  }, []);
  
  const markAsApplied = useCallback((jobId: string) => {
    jobStore.markAsApplied(jobId);
  }, []);
  
  const isJobApplied = useCallback((jobId: string): boolean => {
    return jobStore.isJobApplied(jobId);
  }, []);
  
  const getJobById = useCallback(async (id: string): Promise<Job | null> => {
    return jobStore.getJobById(id);
  }, []);
  
  const clearError = useCallback(() => {
    jobStore.clearError();
  }, []);
  
  return {
    // State
    resume: state.resume,
    jobs: state.jobs,
    matchResults: state.matchResults,
    filters: state.filters,
    savedJobs: state.savedJobs,
    appliedJobs: state.appliedJobs,
    searchHistory: state.searchHistory,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    fetchJobs,
    setResume,
    clearResume,
    setFilters,
    clearFilters,
    applyFilters,
    saveJob,
    unsaveJob,
    isJobSaved,
    markAsApplied,
    isJobApplied,
    getJobById,
    clearError,
  };
}
