import { v4 as uuidv4 } from 'uuid';
import { Job, JobFilter } from '@/types';
import { BaseJobAdapter } from './base-adapter';

/**
 * Glassdoor Job Adapter
 * 
 * Provides job listings from Glassdoor.
 * Uses mock data for development.
 */
export class GlassdoorAdapter extends BaseJobAdapter {
  name = 'Glassdoor';
  enabled = true;
  isRestricted = true;
  
  private mockJobs: Job[] = [
    {
      id: uuidv4(),
      title: 'Staff Software Engineer',
      company: 'FinTech Innovations',
      companyLogo: 'https://ui-avatars.com/api/?name=FI&background=059669&color=fff',
      location: 'New York, NY',
      locationType: 'hybrid',
      salary: { min: 220000, max: 280000, currency: 'USD', period: 'yearly' },
      seniority: 'lead',
      jobType: 'full-time',
      description: 'FinTech Innovations is looking for a Staff Software Engineer to lead technical initiatives. You will architect solutions, mentor engineers, and drive technical excellence across the organization.',
      requirements: [
        '8+ years of software engineering',
        'Experience leading technical projects',
        'Strong system design skills',
        'FinTech experience preferred',
      ],
      benefits: ['Top compensation', 'Equity', 'Unlimited PTO', 'Premium healthcare'],
      skills: ['Java', 'Scala', 'Kafka', 'PostgreSQL', 'AWS', 'Microservices', 'System Design'],
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://glassdoor.com/job-listing/example1',
      source: 'Glassdoor',
      sourceId: 'gd-001',
    },
    {
      id: uuidv4(),
      title: 'Product Designer',
      company: 'Creative Labs',
      companyLogo: 'https://ui-avatars.com/api/?name=CL&background=EC4899&color=fff',
      location: 'San Francisco, CA',
      locationType: 'remote',
      salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'Creative Labs seeks a Product Designer to shape user experiences. You will conduct research, create prototypes, and collaborate with engineers to bring designs to life.',
      requirements: [
        '5+ years of product design',
        'Strong portfolio required',
        'Experience with design systems',
        'User research experience',
      ],
      benefits: ['Remote-first', 'Design tools budget', 'Conference attendance', 'Sabbatical'],
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'HTML/CSS'],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://glassdoor.com/job-listing/example2',
      source: 'Glassdoor',
      sourceId: 'gd-002',
    },
    {
      id: uuidv4(),
      title: 'Backend Engineer',
      company: 'ScaleUp Tech',
      companyLogo: 'https://ui-avatars.com/api/?name=ST&background=3B82F6&color=fff',
      location: 'Austin, TX',
      locationType: 'onsite',
      salary: { min: 150000, max: 190000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'ScaleUp Tech needs a Backend Engineer to build scalable APIs and services. You will work on high-traffic systems and optimize performance.',
      requirements: [
        '5+ years of backend development',
        'Experience with Go or Rust',
        'Database optimization skills',
        'High-scale system experience',
      ],
      benefits: ['Competitive salary', 'Stock options', 'Health benefits', 'Gym membership'],
      skills: ['Go', 'Rust', 'PostgreSQL', 'Redis', 'gRPC', 'Kubernetes', 'Performance'],
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://glassdoor.com/job-listing/example3',
      source: 'Glassdoor',
      sourceId: 'gd-003',
    },
    {
      id: uuidv4(),
      title: 'Engineering Manager',
      company: 'Growth Dynamics',
      companyLogo: 'https://ui-avatars.com/api/?name=GD&background=F59E0B&color=fff',
      location: 'Seattle, WA',
      locationType: 'hybrid',
      salary: { min: 200000, max: 260000, currency: 'USD', period: 'yearly' },
      seniority: 'lead',
      jobType: 'full-time',
      description: 'Growth Dynamics is hiring an Engineering Manager to lead a team of talented engineers. You will set technical direction, grow team members, and deliver impactful products.',
      requirements: [
        '7+ years of engineering experience',
        '2+ years of management experience',
        'Track record of team growth',
        'Strong technical background',
      ],
      benefits: ['Executive compensation', 'Leadership coaching', 'Equity package', 'Flexible work'],
      skills: ['Leadership', 'Technical Strategy', 'Hiring', 'Agile', 'Mentoring', 'Architecture'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://glassdoor.com/job-listing/example4',
      source: 'Glassdoor',
      sourceId: 'gd-004',
    },
    {
      id: uuidv4(),
      title: 'Security Engineer',
      company: 'CyberShield',
      companyLogo: 'https://ui-avatars.com/api/?name=CS&background=EF4444&color=fff',
      location: 'Washington, DC',
      locationType: 'onsite',
      salary: { min: 160000, max: 200000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'CyberShield needs a Security Engineer to protect our infrastructure. You will conduct security assessments, implement controls, and respond to incidents.',
      requirements: [
        '5+ years of security experience',
        'CISSP or similar certification',
        'Penetration testing skills',
        'Cloud security experience',
      ],
      benefits: ['Security clearance support', 'Training budget', 'Certification reimbursement', 'Top benefits'],
      skills: ['Security', 'Penetration Testing', 'AWS Security', 'SIEM', 'Incident Response', 'Compliance'],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://glassdoor.com/job-listing/example5',
      source: 'Glassdoor',
      sourceId: 'gd-005',
    },
  ];
  
  async fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 450));
    
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

export const glassdoorAdapter = new GlassdoorAdapter();
