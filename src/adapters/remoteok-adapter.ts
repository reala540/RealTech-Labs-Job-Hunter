import { v4 as uuidv4 } from 'uuid';
import { Job, JobFilter } from '@/types';
import { BaseJobAdapter } from './base-adapter';

/**
 * RemoteOK Job Adapter
 * 
 * Provides remote job listings.
 * RemoteOK has a public API that can be used.
 */
export class RemoteOKAdapter extends BaseJobAdapter {
  name = 'RemoteOK';
  enabled = true;
  isRestricted = false;
  
  private apiEnabled = false; // Set to true to use real API
  
  private mockJobs: Job[] = [
    {
      id: uuidv4(),
      title: 'Remote React Developer',
      company: 'GlobalTech',
      companyLogo: 'https://ui-avatars.com/api/?name=GT&background=6366F1&color=fff',
      location: 'Worldwide',
      locationType: 'remote',
      salary: { min: 100000, max: 150000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'GlobalTech is hiring a Remote React Developer to work on our flagship product. Fully remote position with flexible hours. Join a distributed team across multiple time zones.',
      requirements: [
        '3+ years of React experience',
        'Strong TypeScript skills',
        'Experience with remote work',
        'Self-motivated and organized',
      ],
      benefits: ['Fully remote', 'Flexible hours', 'Home office stipend', 'Annual meetups'],
      skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Tailwind CSS', 'Git'],
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://remoteok.com/remote-jobs/example1',
      source: 'RemoteOK',
      sourceId: 'rok-001',
    },
    {
      id: uuidv4(),
      title: 'Remote DevOps Specialist',
      company: 'CloudNative Inc',
      companyLogo: 'https://ui-avatars.com/api/?name=CN&background=10B981&color=fff',
      location: 'Americas',
      locationType: 'remote',
      salary: { min: 130000, max: 170000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'CloudNative Inc seeks a Remote DevOps Specialist to manage our cloud infrastructure. Work from anywhere in the Americas time zones.',
      requirements: [
        '5+ years of DevOps experience',
        'AWS or GCP expertise',
        'Kubernetes certification preferred',
        'Strong automation skills',
      ],
      benefits: ['Remote work', 'Certification budget', 'Equipment allowance', 'Unlimited PTO'],
      skills: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'CI/CD', 'Python', 'Monitoring'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://remoteok.com/remote-jobs/example2',
      source: 'RemoteOK',
      sourceId: 'rok-002',
    },
    {
      id: uuidv4(),
      title: 'Remote Python Developer',
      company: 'DataFlow Systems',
      companyLogo: 'https://ui-avatars.com/api/?name=DF&background=3B82F6&color=fff',
      location: 'Europe',
      locationType: 'remote',
      salary: { min: 90000, max: 130000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'DataFlow Systems is looking for a Remote Python Developer to build data pipelines. European time zone preferred for team collaboration.',
      requirements: [
        '3+ years of Python experience',
        'Data engineering background',
        'SQL proficiency',
        'European time zone',
      ],
      benefits: ['Remote-first', 'Learning budget', 'Health insurance', 'Team retreats'],
      skills: ['Python', 'SQL', 'Apache Airflow', 'Spark', 'PostgreSQL', 'Docker'],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://remoteok.com/remote-jobs/example3',
      source: 'RemoteOK',
      sourceId: 'rok-003',
    },
    {
      id: uuidv4(),
      title: 'Remote Technical Writer',
      company: 'DocuTech',
      companyLogo: 'https://ui-avatars.com/api/?name=DT&background=8B5CF6&color=fff',
      location: 'Worldwide',
      locationType: 'remote',
      salary: { min: 70000, max: 100000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'DocuTech needs a Remote Technical Writer to create developer documentation. Work with engineering teams to document APIs and SDKs.',
      requirements: [
        '3+ years of technical writing',
        'Developer documentation experience',
        'Basic coding knowledge',
        'Excellent English skills',
      ],
      benefits: ['Fully remote', 'Flexible schedule', 'Writing tools provided', 'Async-first culture'],
      skills: ['Technical Writing', 'API Documentation', 'Markdown', 'Git', 'Developer Tools'],
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://remoteok.com/remote-jobs/example4',
      source: 'RemoteOK',
      sourceId: 'rok-004',
    },
    {
      id: uuidv4(),
      title: 'Remote Mobile Developer',
      company: 'AppVenture',
      companyLogo: 'https://ui-avatars.com/api/?name=AV&background=F59E0B&color=fff',
      location: 'Worldwide',
      locationType: 'remote',
      salary: { min: 110000, max: 160000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'AppVenture is hiring a Remote Mobile Developer to build cross-platform apps. Experience with React Native or Flutter required.',
      requirements: [
        '5+ years of mobile development',
        'React Native or Flutter expertise',
        'Published apps in stores',
        'Strong UI/UX sense',
      ],
      benefits: ['Remote work', 'Device budget', 'App store accounts', 'Conference attendance'],
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'TypeScript', 'Mobile UI'],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://remoteok.com/remote-jobs/example5',
      source: 'RemoteOK',
      sourceId: 'rok-005',
    },
    {
      id: uuidv4(),
      title: 'Remote Customer Success Engineer',
      company: 'SaaS Solutions',
      companyLogo: 'https://ui-avatars.com/api/?name=SS&background=EC4899&color=fff',
      location: 'North America',
      locationType: 'remote',
      salary: { min: 85000, max: 115000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'SaaS Solutions seeks a Remote Customer Success Engineer to help customers succeed. Technical background with customer-facing experience required.',
      requirements: [
        '2+ years in customer success',
        'Technical troubleshooting skills',
        'API integration experience',
        'Excellent communication',
      ],
      benefits: ['Remote position', 'Customer success tools', 'Training programs', 'Career growth'],
      skills: ['Customer Success', 'Technical Support', 'API', 'SQL', 'Communication', 'Problem Solving'],
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://remoteok.com/remote-jobs/example6',
      source: 'RemoteOK',
      sourceId: 'rok-006',
    },
  ];
  
  async fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Real API integration (disabled by default)
    if (this.apiEnabled) {
      try {
        const response = await this.rateLimitedFetch('https://remoteok.com/api');
        if (response.ok) {
          const data = await response.json();
          // Transform API response to Job format
          // Note: Actual implementation would parse the response
          console.log('RemoteOK API response received');
        }
      } catch (error) {
        console.error('RemoteOK API error:', error);
      }
    }
    
    let jobs = this.mockJobs;
    
    if (query) {
      const queryLower = query.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(queryLower) ||
        job.company.toLowerCase().includes(queryLower) ||
        job.description.toLowerCase().includes(queryLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(queryLower))
      );
    }
    
    return this.applyFilters(jobs, filters);
  }
  
  async getJobById(id: string): Promise<Job | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockJobs.find(job => job.id === id || job.sourceId === id) || null;
  }
  
  enableApi(enable: boolean): void {
    this.apiEnabled = enable;
  }
}

export const remoteOKAdapter = new RemoteOKAdapter();
