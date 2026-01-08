import { v4 as uuidv4 } from 'uuid';
import { Job, JobFilter } from '@/types';
import { BaseJobAdapter } from './base-adapter';

/**
 * LinkedIn Job Adapter
 * 
 * IMPORTANT: LinkedIn restricts automated access to their platform.
 * This adapter provides:
 * 1. A mock connector for development/testing
 * 2. A disabled-by-default scraper abstraction
 * 
 * For production use, consider:
 * - LinkedIn's official Partner API (requires partnership)
 * - Manual job posting integration
 * - User-provided job URLs
 */
export class LinkedInAdapter extends BaseJobAdapter {
  name = 'LinkedIn';
  enabled = true; // Mock data is always available
  isRestricted = true;
  
  // Scraping is disabled by default due to LinkedIn's ToS
  private scrapingEnabled = false;
  
  // Mock job data for development
  private mockJobs: Job[] = [
    {
      id: uuidv4(),
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      companyLogo: 'https://ui-avatars.com/api/?name=TC&background=0077B5&color=fff',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      salary: { min: 180000, max: 220000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and implementing scalable backend systems, mentoring junior developers, and collaborating with cross-functional teams to deliver high-quality products.',
      requirements: [
        '5+ years of software development experience',
        'Strong proficiency in Python or Java',
        'Experience with distributed systems',
        'Excellent communication skills',
        'BS/MS in Computer Science or equivalent',
      ],
      benefits: ['Health insurance', '401k matching', 'Unlimited PTO', 'Remote work options'],
      skills: ['Python', 'Java', 'AWS', 'Kubernetes', 'PostgreSQL', 'Redis', 'GraphQL'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://linkedin.com/jobs/view/example1',
      source: 'LinkedIn',
      sourceId: 'li-001',
    },
    {
      id: uuidv4(),
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      companyLogo: 'https://ui-avatars.com/api/?name=SX&background=00A0DC&color=fff',
      location: 'New York, NY',
      locationType: 'remote',
      salary: { min: 120000, max: 160000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'Join our fast-paced startup as a Full Stack Developer. You will work on building new features for our SaaS platform, from database design to frontend implementation. We value creativity, ownership, and continuous learning.',
      requirements: [
        '3+ years of full stack development',
        'Experience with React and Node.js',
        'Familiarity with cloud services',
        'Strong problem-solving skills',
      ],
      benefits: ['Equity package', 'Flexible hours', 'Learning budget', 'Team retreats'],
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'],
      postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://linkedin.com/jobs/view/example2',
      source: 'LinkedIn',
      sourceId: 'li-002',
    },
    {
      id: uuidv4(),
      title: 'Machine Learning Engineer',
      company: 'AI Innovations',
      companyLogo: 'https://ui-avatars.com/api/?name=AI&background=8B5CF6&color=fff',
      location: 'Seattle, WA',
      locationType: 'hybrid',
      salary: { min: 200000, max: 280000, currency: 'USD', period: 'yearly' },
      seniority: 'senior',
      jobType: 'full-time',
      description: 'We are seeking a Machine Learning Engineer to develop and deploy ML models at scale. You will work on cutting-edge NLP and computer vision projects, collaborating with research scientists and product teams.',
      requirements: [
        '5+ years in ML/AI development',
        'Strong background in deep learning',
        'Experience with PyTorch or TensorFlow',
        'Published research is a plus',
        'MS/PhD in ML, AI, or related field',
      ],
      benefits: ['Top-tier compensation', 'Research time', 'Conference attendance', 'Visa sponsorship'],
      skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'MLOps', 'Kubernetes'],
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://linkedin.com/jobs/view/example3',
      source: 'LinkedIn',
      sourceId: 'li-003',
    },
    {
      id: uuidv4(),
      title: 'DevOps Engineer',
      company: 'CloudScale Systems',
      companyLogo: 'https://ui-avatars.com/api/?name=CS&background=F59E0B&color=fff',
      location: 'Austin, TX',
      locationType: 'onsite',
      salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'CloudScale is looking for a DevOps Engineer to help us scale our infrastructure. You will design and maintain CI/CD pipelines, manage cloud resources, and ensure high availability of our services.',
      requirements: [
        '3+ years of DevOps experience',
        'Strong knowledge of AWS or GCP',
        'Experience with Terraform and Ansible',
        'Kubernetes expertise required',
      ],
      benefits: ['Competitive salary', 'Health benefits', 'Professional development', 'Modern office'],
      skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'Jenkins', 'Python', 'Linux'],
      postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://linkedin.com/jobs/view/example4',
      source: 'LinkedIn',
      sourceId: 'li-004',
    },
    {
      id: uuidv4(),
      title: 'Frontend Engineer',
      company: 'DesignFirst',
      companyLogo: 'https://ui-avatars.com/api/?name=DF&background=EC4899&color=fff',
      location: 'Los Angeles, CA',
      locationType: 'remote',
      salary: { min: 130000, max: 170000, currency: 'USD', period: 'yearly' },
      seniority: 'mid',
      jobType: 'full-time',
      description: 'DesignFirst is hiring a Frontend Engineer passionate about creating beautiful, performant user interfaces. You will work closely with our design team to implement pixel-perfect UIs and improve user experience.',
      requirements: [
        '3+ years of frontend development',
        'Expert-level React knowledge',
        'Strong CSS and animation skills',
        'Eye for design and attention to detail',
      ],
      benefits: ['Remote-first culture', 'Design tools budget', 'Flexible schedule', 'Annual bonus'],
      skills: ['React', 'TypeScript', 'CSS', 'Tailwind', 'Framer Motion', 'Figma', 'Next.js'],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      applicationUrl: 'https://linkedin.com/jobs/view/example5',
      source: 'LinkedIn',
      sourceId: 'li-005',
    },
  ];
  
  async fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (this.scrapingEnabled) {
      // DISABLED: Real scraping would go here
      // This is intentionally not implemented due to LinkedIn's ToS
      console.warn('LinkedIn scraping is disabled. Using mock data.');
    }
    
    // Filter mock jobs based on query
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
    
    // Apply additional filters
    return this.applyFilters(jobs, filters);
  }
  
  async getJobById(id: string): Promise<Job | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockJobs.find(job => job.id === id || job.sourceId === id) || null;
  }
  
  // Method to enable scraping (disabled by default for ethical reasons)
  enableScraping(enable: boolean): void {
    console.warn(
      enable
        ? 'WARNING: Enabling LinkedIn scraping may violate their Terms of Service.'
        : 'LinkedIn scraping disabled.'
    );
    this.scrapingEnabled = enable;
  }
}

export const linkedInAdapter = new LinkedInAdapter();
