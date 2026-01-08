import { v4 as uuidv4 } from 'uuid';
import { Job, JobFilter } from '@/types';
import { BaseJobAdapter } from './base-adapter';

/**
 * Indeed Job Adapter
 * 
 * Provides job listings from Indeed.
 * Uses mock data for development, with scraper abstraction for production.
 */
export class IndeedAdapter extends BaseJobAdapter {
  name = 'Indeed';
  enabled = true;
  isRestricted = false;
  
  private scrapingEnabled = false;
  
  private mockJobs: Job[] = [
    {
      id: uuidv4(),
      title: 'Software Developer',
      company: 'Enterprise Solutions Inc.',
      companyLogo: 'https://ui-avatars.com/api/?name=ES&background=2557A7&color=fff',
      location: 'Chicago, IL',
      locationType: 'onsite',
      salary: { min: 95000, max: 125000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'Enterprise Solutions is seeking a Software Developer to join our team. You will develop and maintain enterprise applications, work with stakeholders to gather requirements, and ensure code quality through testing.',
      requirements: [
        '3+ years of software development',
        'Experience with Java or C#',
        'Knowledge of SQL databases',
        'Agile methodology experience',
      ],
      benefits: ['Medical/dental/vision', '401k', 'Paid holidays', 'Training programs'],
      skills: ['Java', 'C#', '.NET', 'SQL Server', 'Azure', 'Agile', 'Git'],
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://indeed.com/viewjob?jk=example1',
      source: 'Indeed',
      sourceId: 'ind-001',
    },
    {
      id: uuidv4(),
      title: 'Junior Web Developer',
      company: 'Digital Agency Pro',
      companyLogo: 'https://ui-avatars.com/api/?name=DA&background=6366F1&color=fff',
      location: 'Miami, FL',
      locationType: 'hybrid',
      salary: { min: 55000, max: 75000, currency: 'USD', period: 'yearly' },
      seniority: 'entry',
      jobType: 'full-time',
      description: 'Looking for a Junior Web Developer to join our creative agency. You will work on client websites, learn from senior developers, and grow your skills in a supportive environment.',
      requirements: [
        '0-2 years of experience',
        'Knowledge of HTML, CSS, JavaScript',
        'Willingness to learn',
        'Portfolio of projects',
      ],
      benefits: ['Mentorship program', 'Flexible hours', 'Creative environment', 'Growth opportunities'],
      skills: ['HTML', 'CSS', 'JavaScript', 'WordPress', 'PHP', 'Figma'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://indeed.com/viewjob?jk=example2',
      source: 'Indeed',
      sourceId: 'ind-002',
    },
    {
      id: uuidv4(),
      title: 'Data Analyst',
      company: 'Analytics Corp',
      companyLogo: 'https://ui-avatars.com/api/?name=AC&background=10B981&color=fff',
      location: 'Denver, CO',
      locationType: 'remote',
      salary: { min: 80000, max: 110000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'Analytics Corp is hiring a Data Analyst to transform data into insights. You will create dashboards, analyze trends, and present findings to stakeholders.',
      requirements: [
        '2+ years of data analysis',
        'Proficiency in SQL and Python',
        'Experience with BI tools',
        'Strong communication skills',
      ],
      benefits: ['Remote work', 'Health insurance', 'Learning stipend', 'Home office setup'],
      skills: ['SQL', 'Python', 'Tableau', 'Power BI', 'Excel', 'Statistics'],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://indeed.com/viewjob?jk=example3',
      source: 'Indeed',
      sourceId: 'ind-003',
    },
    {
      id: uuidv4(),
      title: 'QA Engineer',
      company: 'Quality First Software',
      companyLogo: 'https://ui-avatars.com/api/?name=QF&background=EF4444&color=fff',
      location: 'Boston, MA',
      locationType: 'hybrid',
      salary: { min: 90000, max: 120000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'Join our QA team to ensure software quality. You will design test plans, automate tests, and work closely with developers to identify and fix issues.',
      requirements: [
        '3+ years of QA experience',
        'Test automation experience',
        'Knowledge of testing frameworks',
        'Attention to detail',
      ],
      benefits: ['Comprehensive benefits', 'Flexible schedule', 'Career growth', 'Team events'],
      skills: ['Selenium', 'Cypress', 'Jest', 'Python', 'SQL', 'Jira', 'API Testing'],
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://indeed.com/viewjob?jk=example4',
      source: 'Indeed',
      sourceId: 'ind-004',
    },
    {
      id: uuidv4(),
      title: 'Technical Project Manager',
      company: 'Project Masters',
      companyLogo: 'https://ui-avatars.com/api/?name=PM&background=8B5CF6&color=fff',
      location: 'Atlanta, GA',
      locationType: 'onsite',
      salary: { min: 110000, max: 145000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'We need a Technical Project Manager to lead software development projects. You will coordinate teams, manage timelines, and ensure successful project delivery.',
      requirements: [
        '5+ years of project management',
        'Technical background preferred',
        'PMP certification is a plus',
        'Excellent leadership skills',
      ],
      benefits: ['Competitive salary', 'Bonus program', 'Professional development', 'Leadership training'],
      skills: ['Project Management', 'Agile', 'Scrum', 'Jira', 'Confluence', 'Risk Management'],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://indeed.com/viewjob?jk=example5',
      source: 'Indeed',
      sourceId: 'ind-005',
    },
  ];
  
  async fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
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

export const indeedAdapter = new IndeedAdapter();
