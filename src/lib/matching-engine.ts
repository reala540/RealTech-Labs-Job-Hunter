import { Resume, Job, MatchResult } from '@/types';

// Skill categories for better matching
const SKILL_CATEGORIES: Record<string, string[]> = {
  frontend: ['react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'javascript', 'typescript'],
  backend: ['node.js', 'express', 'django', 'flask', 'spring', 'rails', 'laravel', 'graphql', 'rest', 'python', 'java', 'go', 'rust', 'php'],
  database: ['postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'supabase', 'sql'],
  cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd'],
  data: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'spark', 'data science'],
  mobile: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
  design: ['figma', 'sketch', 'adobe xd', 'ui/ux', 'design systems'],
};

// Seniority level mapping
const SENIORITY_LEVELS: Record<string, number> = {
  intern: 0,
  entry: 1,
  mid: 2,
  senior: 3,
  lead: 4,
  executive: 5,
};

// Calculate years of experience from resume
function calculateYearsOfExperience(resume: Resume): number {
  let totalYears = 0;
  
  for (const exp of resume.experience) {
    if (exp.startDate && exp.endDate) {
      const start = new Date(exp.startDate);
      const end = exp.endDate.toLowerCase() === 'present' ? new Date() : new Date(exp.endDate);
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      totalYears += Math.max(0, years);
    } else {
      // Assume 2 years if dates not specified
      totalYears += 2;
    }
  }
  
  return Math.round(totalYears * 10) / 10;
}

// Estimate seniority from years of experience
function estimateSeniority(yearsOfExperience: number): string {
  if (yearsOfExperience < 1) return 'intern';
  if (yearsOfExperience < 2) return 'entry';
  if (yearsOfExperience < 5) return 'mid';
  if (yearsOfExperience < 8) return 'senior';
  if (yearsOfExperience < 12) return 'lead';
  return 'executive';
}

// Tokenize text for keyword matching
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s.-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
}

// Calculate TF-IDF-like score for keyword matching
function calculateKeywordScore(resumeText: string, jobText: string): number {
  const resumeTokens = new Set(tokenize(resumeText));
  const jobTokens = tokenize(jobText);
  
  if (jobTokens.length === 0) return 0;
  
  let matchCount = 0;
  for (const token of jobTokens) {
    if (resumeTokens.has(token)) {
      matchCount++;
    }
  }
  
  return (matchCount / jobTokens.length) * 100;
}

// Calculate skill overlap
function calculateSkillMatch(resumeSkills: string[], jobSkills: string[]): {
  score: number;
  matched: string[];
  missing: string[];
} {
  const resumeSkillsLower = new Set(resumeSkills.map(s => s.toLowerCase()));
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase());
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  for (const skill of jobSkills) {
    const skillLower = skill.toLowerCase();
    if (resumeSkillsLower.has(skillLower)) {
      matched.push(skill);
    } else {
      // Check for related skills in same category
      let foundRelated = false;
      for (const [category, categorySkills] of Object.entries(SKILL_CATEGORIES)) {
        if (categorySkills.includes(skillLower)) {
          const hasRelated = categorySkills.some(s => resumeSkillsLower.has(s));
          if (hasRelated) {
            foundRelated = true;
            matched.push(skill + ' (related)');
            break;
          }
        }
      }
      if (!foundRelated) {
        missing.push(skill);
      }
    }
  }
  
  const score = jobSkills.length > 0 ? (matched.length / jobSkills.length) * 100 : 50;
  
  return { score, matched, missing };
}

// Calculate experience relevance
function calculateExperienceMatch(resume: Resume, job: Job): {
  score: number;
  relevance: string;
} {
  const yearsOfExperience = calculateYearsOfExperience(resume);
  const estimatedSeniority = estimateSeniority(yearsOfExperience);
  
  const resumeLevel = SENIORITY_LEVELS[estimatedSeniority] || 2;
  const jobLevel = SENIORITY_LEVELS[job.seniority] || 2;
  
  const levelDiff = Math.abs(resumeLevel - jobLevel);
  
  let score = 100;
  let relevance = '';
  
  if (levelDiff === 0) {
    score = 100;
    relevance = `Your ${yearsOfExperience.toFixed(1)} years of experience is an excellent match for this ${job.seniority} position.`;
  } else if (levelDiff === 1) {
    score = 80;
    if (resumeLevel > jobLevel) {
      relevance = `You may be overqualified with ${yearsOfExperience.toFixed(1)} years of experience for this ${job.seniority} role, but could be a strong candidate.`;
    } else {
      relevance = `This ${job.seniority} role is a stretch opportunity for your ${yearsOfExperience.toFixed(1)} years of experience.`;
    }
  } else if (levelDiff === 2) {
    score = 50;
    if (resumeLevel > jobLevel) {
      relevance = `You appear significantly overqualified for this ${job.seniority} position.`;
    } else {
      relevance = `This ${job.seniority} role may require more experience than your current ${yearsOfExperience.toFixed(1)} years.`;
    }
  } else {
    score = 20;
    relevance = `There's a significant experience gap between your background and this ${job.seniority} position.`;
  }
  
  // Bonus for relevant job titles
  const resumeTitles = resume.experience.map(e => e.title.toLowerCase());
  const jobTitleLower = job.title.toLowerCase();
  
  const hasSimilarTitle = resumeTitles.some(title => {
    const titleWords = title.split(/\s+/);
    const jobWords = jobTitleLower.split(/\s+/);
    return titleWords.some(w => jobWords.includes(w) && w.length > 3);
  });
  
  if (hasSimilarTitle) {
    score = Math.min(100, score + 15);
    relevance += ' Your previous job titles are relevant to this role.';
  }
  
  return { score, relevance };
}

// Calculate location match
function calculateLocationMatch(resume: Resume, job: Job): number {
  // Remote jobs always match
  if (job.locationType === 'remote') {
    return 100;
  }
  
  // If no resume location, assume partial match
  if (!resume.location) {
    return job.locationType === 'hybrid' ? 70 : 50;
  }
  
  const resumeLocation = resume.location.toLowerCase();
  const jobLocation = job.location.toLowerCase();
  
  // Check for city/state match
  const resumeParts = resumeLocation.split(/[,\s]+/);
  const jobParts = jobLocation.split(/[,\s]+/);
  
  const hasMatch = resumeParts.some(part => 
    jobParts.some(jobPart => 
      part.length > 2 && jobPart.includes(part)
    )
  );
  
  if (hasMatch) {
    return 100;
  }
  
  // Hybrid has some flexibility
  if (job.locationType === 'hybrid') {
    return 60;
  }
  
  return 30;
}

// Generate recommendations based on match analysis
function generateRecommendations(
  resume: Resume,
  job: Job,
  skillMatch: { matched: string[]; missing: string[] },
  experienceMatch: { score: number }
): string[] {
  const recommendations: string[] = [];
  
  // Skill recommendations
  if (skillMatch.missing.length > 0 && skillMatch.missing.length <= 3) {
    recommendations.push(
      `Consider highlighting or developing these skills: ${skillMatch.missing.join(', ')}`
    );
  } else if (skillMatch.missing.length > 3) {
    recommendations.push(
      `This role requires several skills you may want to develop: ${skillMatch.missing.slice(0, 3).join(', ')}, and ${skillMatch.missing.length - 3} more.`
    );
  }
  
  // Experience recommendations
  if (experienceMatch.score < 60) {
    const yearsOfExperience = calculateYearsOfExperience(resume);
    if (yearsOfExperience < 2) {
      recommendations.push(
        'Highlight relevant projects, internships, or coursework to strengthen your application.'
      );
    }
  }
  
  // Keyword recommendations
  if (job.requirements.length > 0) {
    const resumeText = resume.rawText.toLowerCase();
    const missingKeywords = job.requirements.filter(req => 
      !resumeText.includes(req.toLowerCase().split(' ')[0])
    );
    if (missingKeywords.length > 0) {
      recommendations.push(
        'Tailor your resume to include keywords from the job requirements.'
      );
    }
  }
  
  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push(
      'Your profile is a strong match! Customize your cover letter to highlight relevant achievements.'
    );
  }
  
  return recommendations.slice(0, 3);
}

// Main matching function
export function calculateMatch(resume: Resume, job: Job): MatchResult {
  // Calculate individual scores
  const skillMatch = calculateSkillMatch(resume.skills, job.skills);
  const experienceMatch = calculateExperienceMatch(resume, job);
  const keywordScore = calculateKeywordScore(
    resume.rawText + ' ' + resume.skills.join(' '),
    job.description + ' ' + job.requirements.join(' ') + ' ' + job.skills.join(' ')
  );
  const locationScore = calculateLocationMatch(resume, job);
  
  // Seniority match
  const yearsOfExperience = calculateYearsOfExperience(resume);
  const estimatedSeniority = estimateSeniority(yearsOfExperience);
  const seniorityScore = estimatedSeniority === job.seniority ? 100 :
    Math.abs(SENIORITY_LEVELS[estimatedSeniority] - SENIORITY_LEVELS[job.seniority]) === 1 ? 70 : 40;
  
  // Calculate weighted overall score
  const weights = {
    skills: 0.35,
    experience: 0.25,
    keywords: 0.20,
    location: 0.10,
    seniority: 0.10,
  };
  
  const overallScore = Math.round(
    skillMatch.score * weights.skills +
    experienceMatch.score * weights.experience +
    keywordScore * weights.keywords +
    locationScore * weights.location +
    seniorityScore * weights.seniority
  );
  
  // Generate recommendations
  const recommendations = generateRecommendations(resume, job, skillMatch, experienceMatch);
  
  return {
    job,
    score: Math.min(100, Math.max(0, overallScore)),
    breakdown: {
      skillsMatch: Math.round(skillMatch.score),
      experienceMatch: Math.round(experienceMatch.score),
      keywordMatch: Math.round(keywordScore),
      locationMatch: Math.round(locationScore),
      seniorityMatch: Math.round(seniorityScore),
    },
    matchedSkills: skillMatch.matched,
    missingSkills: skillMatch.missing,
    experienceRelevance: experienceMatch.relevance,
    recommendations,
  };
}

// Batch matching with sorting
export function matchJobsToResume(resume: Resume, jobs: Job[]): MatchResult[] {
  const results = jobs.map(job => calculateMatch(resume, job));
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return results;
}

// Generate simple text embedding (TF-IDF-like vector)
export function generateEmbedding(text: string): number[] {
  const tokens = tokenize(text);
  const tokenCounts = new Map<string, number>();
  
  for (const token of tokens) {
    tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
  }
  
  // Create a fixed-size vector based on common tech terms
  const vocabulary = [
    'javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes',
    'sql', 'api', 'frontend', 'backend', 'fullstack', 'data', 'machine',
    'learning', 'cloud', 'devops', 'agile', 'scrum', 'design', 'product',
    'manager', 'engineer', 'developer', 'senior', 'junior', 'lead', 'team',
    'experience', 'skills', 'project', 'system', 'software', 'web', 'mobile',
    'database', 'security', 'testing', 'deployment', 'integration', 'performance',
    'optimization', 'architecture', 'microservices', 'rest', 'graphql', 'typescript',
    'java', 'go', 'rust', 'scala', 'ruby', 'php', 'swift', 'kotlin',
  ];
  
  const embedding: number[] = vocabulary.map(word => {
    const count = tokenCounts.get(word) || 0;
    // TF-IDF-like normalization
    return count > 0 ? Math.log(1 + count) / Math.log(1 + tokens.length) : 0;
  });
  
  // Normalize the vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    return embedding.map(val => val / magnitude);
  }
  
  return embedding;
}

// Calculate cosine similarity between embeddings
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
  
  return magnitude > 0 ? dotProduct / magnitude : 0;
}
