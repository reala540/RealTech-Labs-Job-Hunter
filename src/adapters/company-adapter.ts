import { v4 as uuidv4 } from 'uuid';
import { Job, JobFilter } from '@/types';
import { BaseJobAdapter } from './base-adapter';

/**
 * Company Career Pages Adapter
 * 
 * Aggregates jobs from company career pages.
 * Uses mock data representing various company career pages.
 */
export class CompanyPagesAdapter extends BaseJobAdapter {
  name = 'Company Pages';
  enabled = true;
  isRestricted = false;
  
  private mockJobs: Job[] = [
    {
      id: uuidv4(),
      title: 'Software Engineer, Infrastructure',
      company: 'Stripe',
      companyLogo: 'https://ui-avatars.com/api/?name=Stripe&background=635BFF&color=fff',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      salary: { min: 180000, max: 250000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Join Stripe\'s infrastructure team to build the systems that power internet commerce. You will work on distributed systems, databases, and developer tools used by millions.',
      requirements: [
        '5+ years of infrastructure experience',
        'Distributed systems expertise',
        'Strong coding skills in Go, Ruby, or Java',
        'Experience with large-scale systems',
      ],
      benefits: ['Competitive compensation', 'Equity', 'Health coverage', 'Learning budget'],
      skills: ['Go', 'Ruby', 'Distributed Systems', 'Kubernetes', 'PostgreSQL', 'AWS'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://stripe.com/jobs/listing/example1',
      source: 'Company Pages',
      sourceId: 'cp-stripe-001',
    },
    {
      id: uuidv4(),
      title: 'Frontend Engineer',
      company: 'Vercel',
      companyLogo: 'https://ui-avatars.com/api/?name=Vercel&background=000000&color=fff',
      location: 'Remote',
      locationType: 'remote',
      salary: { min: 150000, max: 200000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Vercel is looking for a Frontend Engineer to work on Next.js and our deployment platform. Help shape the future of web development.',
      requirements: [
        '5+ years of frontend experience',
        'Deep React/Next.js knowledge',
        'Performance optimization skills',
        'Open source contributions a plus',
      ],
      benefits: ['Remote-first', 'Unlimited PTO', 'Equipment budget', 'Stock options'],
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Performance', 'Web APIs'],
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://vercel.com/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-vercel-001',
    },
    {
      id: uuidv4(),
      title: 'Platform Engineer',
      company: 'Supabase',
      companyLogo: 'https://ui-avatars.com/api/?name=Supabase&background=3ECF8E&color=fff',
      location: 'Remote',
      locationType: 'remote',
      salary: { min: 140000, max: 190000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Supabase is hiring a Platform Engineer to scale our open source Firebase alternative. Work on PostgreSQL, real-time systems, and developer tools.',
      requirements: [
        '5+ years of backend experience',
        'PostgreSQL expertise',
        'Experience with real-time systems',
        'Open source mindset',
      ],
      benefits: ['Fully remote', 'Async culture', 'Equity', 'Conference budget'],
      skills: ['PostgreSQL', 'Elixir', 'TypeScript', 'Real-time', 'Docker', 'Open Source'],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://supabase.com/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-supabase-001',
    },
    {
      id: uuidv4(),
      title: 'Machine Learning Engineer',
      company: 'OpenAI',
      companyLogo: 'https://ui-avatars.com/api/?name=OpenAI&background=412991&color=fff',
      location: 'San Francisco, CA',
      locationType: 'onsite',
      salary: { min: 300000, max: 450000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'OpenAI is seeking an ML Engineer to work on cutting-edge AI research and products. Help build safe and beneficial AI systems.',
      requirements: [
        '5+ years of ML experience',
        'Deep learning expertise',
        'Research publication record',
        'PhD preferred',
      ],
      benefits: ['Top compensation', 'Equity', 'Research freedom', 'Impact'],
      skills: ['Python', 'PyTorch', 'Deep Learning', 'NLP', 'Transformers', 'Research'],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://openai.com/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-openai-001',
    },
    {
      id: uuidv4(),
      title: 'Product Engineer',
      company: 'Linear',
      companyLogo: 'https://ui-avatars.com/api/?name=Linear&background=5E6AD2&color=fff',
      location: 'Remote',
      locationType: 'remote',
      salary: { min: 160000, max: 220000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Linear is hiring a Product Engineer to build the best project management tool. Work on complex UI challenges and real-time collaboration.',
      requirements: [
        '5+ years of product engineering',
        'Strong React skills',
        'Eye for design',
        'Product sense',
      ],
      benefits: ['Remote work', 'Competitive pay', 'Equity', 'Minimal meetings'],
      skills: ['React', 'TypeScript', 'GraphQL', 'Real-time', 'UI/UX', 'Product'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://linear.app/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-linear-001',
    },
    {
      id: uuidv4(),
      title: 'Site Reliability Engineer',
      company: 'Datadog',
      companyLogo: 'https://ui-avatars.com/api/?name=Datadog&background=632CA6&color=fff',
      location: 'New York, NY',
      locationType: 'hybrid',
      salary: { min: 170000, max: 230000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Datadog is looking for an SRE to ensure reliability of our monitoring platform. Work on systems that process trillions of data points.',
      requirements: [
        '5+ years of SRE/DevOps experience',
        'Large-scale systems experience',
        'Strong automation skills',
        'On-call experience',
      ],
      benefits: ['Competitive salary', 'Stock options', 'Health benefits', 'Learning budget'],
      skills: ['Kubernetes', 'Go', 'Python', 'Monitoring', 'Incident Response', 'Automation'],
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://datadog.com/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-datadog-001',
    },
    {
      id: uuidv4(),
      title: 'Backend Engineer',
      company: 'Figma',
      companyLogo: 'https://ui-avatars.com/api/?name=Figma&background=F24E1E&color=fff',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      salary: { min: 180000, max: 240000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Figma is hiring a Backend Engineer to scale our collaborative design platform. Work on real-time multiplayer systems and infrastructure.',
      requirements: [
        '5+ years of backend experience',
        'Real-time systems experience',
        'Strong problem-solving skills',
        'Collaborative mindset',
      ],
      benefits: ['Competitive compensation', 'Equity', 'Health benefits', 'Wellness stipend'],
      skills: ['Rust', 'TypeScript', 'PostgreSQL', 'Real-time', 'WebSockets', 'Scaling'],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://figma.com/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-figma-001',
    },
    {
      id: uuidv4(),
      title: 'Developer Advocate',
      company: 'Twilio',
      companyLogo: 'https://ui-avatars.com/api/?name=Twilio&background=F22F46&color=fff',
      location: 'Remote',
      locationType: 'remote',
      salary: { min: 130000, max: 170000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'Twilio is seeking a Developer Advocate to help developers build with our APIs. Create content, speak at events, and engage with the community.',
      requirements: [
        '3+ years of development experience',
        'Public speaking skills',
        'Content creation experience',
        'Community engagement',
      ],
      benefits: ['Remote work', 'Travel budget', 'Conference attendance', 'Learning stipend'],
      skills: ['JavaScript', 'Python', 'APIs', 'Technical Writing', 'Public Speaking', 'Community'],
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://twilio.com/careers/example1',
      source: 'Company Pages',
      sourceId: 'cp-twilio-001',
    },
  ];
  
  async fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
}

export const companyPagesAdapter = new CompanyPagesAdapter();
