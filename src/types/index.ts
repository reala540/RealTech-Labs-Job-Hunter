import { z } from 'zod';

// Resume Schema
export const ResumeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    location: z.string().optional(),
    graduationDate: z.string().optional(),
    gpa: z.string().optional(),
  })),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  rawText: z.string(),
  embedding: z.array(z.number()).optional(),
  createdAt: z.string(),
});

export type Resume = z.infer<typeof ResumeSchema>;

// Job Schema
export const JobSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  companyLogo: z.string().optional(),
  location: z.string(),
  locationType: z.enum(['remote', 'hybrid', 'onsite']),
  salary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default('USD'),
    period: z.enum(['hourly', 'yearly']).default('yearly'),
  }).optional(),
  seniority: z.enum(['intern', 'entry', 'mid', 'senior', 'lead', 'executive']),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
  description: z.string(),
  requirements: z.array(z.string()),
  benefits: z.array(z.string()).optional(),
  skills: z.array(z.string()),
  postedDate: z.string(),
  applicationUrl: z.string().optional(),
  source: z.string(),
  sourceId: z.string().optional(),
  embedding: z.array(z.number()).optional(),
});

export type Job = z.infer<typeof JobSchema>;

// Match Result Schema
export const MatchResultSchema = z.object({
  job: JobSchema,
  score: z.number().min(0).max(100),
  breakdown: z.object({
    skillsMatch: z.number(),
    experienceMatch: z.number(),
    keywordMatch: z.number(),
    locationMatch: z.number(),
    seniorityMatch: z.number(),
  }),
  matchedSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  experienceRelevance: z.string(),
  recommendations: z.array(z.string()),
});

export type MatchResult = z.infer<typeof MatchResultSchema>;

// Filter Schema
export const FilterSchema = z.object({
  roles: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  locationType: z.array(z.enum(['remote', 'hybrid', 'onsite'])).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  seniority: z.array(z.enum(['intern', 'entry', 'mid', 'senior', 'lead', 'executive'])).optional(),
  jobType: z.array(z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship'])).optional(),
  companies: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional(),
  postedWithin: z.enum(['24h', '7d', '30d', 'all']).optional(),
  minMatchScore: z.number().min(0).max(100).optional(),
});

export type JobFilter = z.infer<typeof FilterSchema>;

// Job Source Adapter Interface
export interface JobSourceAdapter {
  name: string;
  enabled: boolean;
  isRestricted: boolean;
  fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]>;
  getJobById(id: string): Promise<Job | null>;
}

// Application State
export interface ApplicationState {
  resume: Resume | null;
  jobs: Job[];
  matchResults: MatchResult[];
  filters: JobFilter;
  savedJobs: string[];
  appliedJobs: string[];
  searchHistory: string[];
  isLoading: boolean;
  error: string | null;
}

// Parsing Progress
export interface ParsingProgress {
  stage: 'uploading' | 'extracting' | 'parsing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  message: string;
}
