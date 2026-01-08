import { v4 as uuidv4 } from 'uuid';
import { Resume, ParsingProgress } from '@/types';

// Common skills database for extraction
const COMMON_SKILLS = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab',
  // Frontend
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui', 'chakra',
  // Backend
  'node.js', 'express', 'fastify', 'django', 'flask', 'spring', 'rails', 'laravel', 'asp.net', 'graphql', 'rest', 'grpc',
  // Databases
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'supabase', 'sqlite', 'oracle', 'sql server',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'github actions', 'gitlab ci', 'circleci',
  // Data & ML
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'spark', 'hadoop', 'airflow',
  // Tools
  'git', 'jira', 'confluence', 'figma', 'sketch', 'adobe xd', 'postman', 'swagger', 'linux', 'bash',
  // Soft Skills
  'agile', 'scrum', 'kanban', 'leadership', 'communication', 'problem-solving', 'teamwork', 'project management',
];

// Job title patterns
const JOB_TITLES = [
  'software engineer', 'senior software engineer', 'staff engineer', 'principal engineer',
  'frontend developer', 'backend developer', 'full stack developer', 'fullstack developer',
  'data scientist', 'data engineer', 'machine learning engineer', 'ml engineer',
  'devops engineer', 'sre', 'site reliability engineer', 'platform engineer',
  'product manager', 'project manager', 'engineering manager', 'tech lead',
  'ux designer', 'ui designer', 'product designer', 'graphic designer',
  'qa engineer', 'test engineer', 'automation engineer',
  'solutions architect', 'cloud architect', 'system architect',
  'intern', 'junior', 'associate', 'consultant', 'analyst',
];

// Education patterns
const DEGREE_PATTERNS = [
  /(?:bachelor(?:'s)?|b\.?s\.?|b\.?a\.?)\s+(?:of\s+)?(?:science|arts|engineering)?/gi,
  /(?:master(?:'s)?|m\.?s\.?|m\.?a\.?|mba)\s+(?:of\s+)?(?:science|arts|business|engineering)?/gi,
  /(?:ph\.?d\.?|doctorate|doctor)\s+(?:of\s+)?(?:philosophy|science|engineering)?/gi,
  /(?:associate(?:'s)?|a\.?s\.?|a\.?a\.?)\s+(?:of\s+)?(?:science|arts)?/gi,
];

const UNIVERSITIES_KEYWORDS = ['university', 'college', 'institute', 'school', 'academy'];

// Email and phone patterns
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;

// Extract skills from text
function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];
  
  for (const skill of COMMON_SKILLS) {
    const skillLower = skill.toLowerCase();
    // Check for word boundary matches
    const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSkills.push(skill);
    }
  }
  
  return [...new Set(foundSkills)];
}

// Extract experience from text
function extractExperience(text: string): Resume['experience'] {
  const experiences: Resume['experience'] = [];
  const lines = text.split('\n');
  
  let currentExperience: Resume['experience'][0] | null = null;
  let inExperienceSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Check for experience section headers
    if (/^(experience|work\s*history|employment|professional\s*experience)/i.test(line)) {
      inExperienceSection = true;
      continue;
    }
    
    // Check for section end
    if (/^(education|skills|certifications|projects|awards)/i.test(line)) {
      if (currentExperience) {
        experiences.push(currentExperience);
        currentExperience = null;
      }
      inExperienceSection = false;
      continue;
    }
    
    if (inExperienceSection && line.length > 0) {
      // Check if this line contains a job title
      const hasJobTitle = JOB_TITLES.some(title => lowerLine.includes(title));
      const hasDatePattern = /\d{4}|present|current/i.test(line);
      
      if (hasJobTitle || (hasDatePattern && line.length < 100)) {
        if (currentExperience) {
          experiences.push(currentExperience);
        }
        
        // Extract dates
        const dateMatch = line.match(/(\w+\s+\d{4}|\d{4})\s*[-–—to]+\s*(\w+\s+\d{4}|\d{4}|present|current)/i);
        
        currentExperience = {
          title: hasJobTitle ? line.split(/\s*[-–—|@at]\s*/)[0].trim() : 'Position',
          company: line.split(/\s*[-–—|@at]\s*/)[1]?.split(/\s*[,|]\s*/)[0]?.trim() || 'Company',
          startDate: dateMatch?.[1] || undefined,
          endDate: dateMatch?.[2] || undefined,
          description: '',
          highlights: [],
        };
      } else if (currentExperience && line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        currentExperience.highlights?.push(line.replace(/^[•\-*]\s*/, ''));
      } else if (currentExperience && line.length > 20) {
        currentExperience.description = (currentExperience.description || '') + ' ' + line;
      }
    }
  }
  
  if (currentExperience) {
    experiences.push(currentExperience);
  }
  
  // If no structured experience found, try to extract from full text
  if (experiences.length === 0) {
    const companyMatches = text.match(/(?:at|@)\s+([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Ltd|Company)?)/g);
    if (companyMatches) {
      companyMatches.slice(0, 3).forEach((match, index) => {
        experiences.push({
          title: 'Professional Role',
          company: match.replace(/^(?:at|@)\s+/, '').trim(),
          description: 'Experience extracted from resume',
        });
      });
    }
  }
  
  return experiences;
}

// Extract education from text
function extractEducation(text: string): Resume['education'] {
  const education: Resume['education'] = [];
  const lines = text.split('\n');
  
  let inEducationSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    if (/^education/i.test(line)) {
      inEducationSection = true;
      continue;
    }
    
    if (/^(experience|skills|certifications|projects)/i.test(line)) {
      inEducationSection = false;
      continue;
    }
    
    if (inEducationSection || UNIVERSITIES_KEYWORDS.some(kw => lowerLine.includes(kw))) {
      // Check for degree patterns
      for (const pattern of DEGREE_PATTERNS) {
        const match = line.match(pattern);
        if (match) {
          const yearMatch = line.match(/\b(19|20)\d{2}\b/);
          education.push({
            degree: match[0].trim(),
            institution: line.replace(match[0], '').replace(/\d{4}/g, '').trim() || 'Institution',
            graduationDate: yearMatch?.[0],
          });
          break;
        }
      }
      
      // Check for university names
      if (education.length === 0 && UNIVERSITIES_KEYWORDS.some(kw => lowerLine.includes(kw))) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        education.push({
          degree: 'Degree',
          institution: line.replace(/\d{4}/g, '').trim(),
          graduationDate: yearMatch?.[0],
        });
      }
    }
  }
  
  return education;
}

// Extract name from text (usually first line or near email)
function extractName(text: string): string {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  
  // First non-empty line is often the name
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if it looks like a name (2-4 words, no special characters)
    if (/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(firstLine)) {
      return firstLine;
    }
  }
  
  // Try to find name near email
  const emailMatch = text.match(EMAIL_PATTERN);
  if (emailMatch) {
    const emailIndex = text.indexOf(emailMatch[0]);
    const nearbyText = text.substring(Math.max(0, emailIndex - 100), emailIndex);
    const nameMatch = nearbyText.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/);
    if (nameMatch) {
      return nameMatch[1];
    }
  }
  
  return 'Candidate';
}

// Extract location from text
function extractLocation(text: string): string | undefined {
  // Common location patterns
  const locationPatterns = [
    /(?:located\s+in|based\s+in|living\s+in)\s+([A-Za-z\s,]+)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z]{2})\b/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*([A-Z][a-z]+)\s+\d{5}/,
  ];
  
  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/^(?:located|based|living)\s+in\s+/i, '').trim();
    }
  }
  
  return undefined;
}

// Extract summary/objective from text
function extractSummary(text: string): string | undefined {
  const lines = text.split('\n');
  let inSummarySection = false;
  let summary = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    const lowerLine = trimmedLine.toLowerCase();
    
    if (/^(summary|objective|profile|about)/i.test(trimmedLine)) {
      inSummarySection = true;
      continue;
    }
    
    if (inSummarySection) {
      if (/^(experience|education|skills|work)/i.test(trimmedLine)) {
        break;
      }
      if (trimmedLine.length > 0) {
        summary += ' ' + trimmedLine;
      }
    }
  }
  
  return summary.trim() || undefined;
}

// Main parsing function
export async function parseResume(
  text: string,
  onProgress?: (progress: ParsingProgress) => void
): Promise<Resume> {
  onProgress?.({ stage: 'extracting', progress: 20, message: 'Extracting contact information...' });
  await new Promise(r => setTimeout(r, 300));
  
  const email = text.match(EMAIL_PATTERN)?.[0];
  const phone = text.match(PHONE_PATTERN)?.[0];
  const name = extractName(text);
  const location = extractLocation(text);
  
  onProgress?.({ stage: 'parsing', progress: 40, message: 'Parsing skills and experience...' });
  await new Promise(r => setTimeout(r, 400));
  
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  
  onProgress?.({ stage: 'parsing', progress: 60, message: 'Extracting education...' });
  await new Promise(r => setTimeout(r, 300));
  
  const education = extractEducation(text);
  const summary = extractSummary(text);
  
  onProgress?.({ stage: 'analyzing', progress: 80, message: 'Analyzing resume content...' });
  await new Promise(r => setTimeout(r, 400));
  
  // Extract certifications (simple pattern matching)
  const certifications: string[] = [];
  const certPatterns = [
    /(?:certified|certification)\s+([A-Za-z\s]+)/gi,
    /\b(AWS|Azure|GCP|PMP|CISSP|CPA|CFA)\s+(?:certified|certification)?/gi,
  ];
  
  for (const pattern of certPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      certifications.push(match[0].trim());
    }
  }
  
  onProgress?.({ stage: 'complete', progress: 100, message: 'Resume parsed successfully!' });
  
  const resume: Resume = {
    id: uuidv4(),
    name,
    email,
    phone,
    location,
    summary,
    skills,
    experience,
    education,
    certifications: certifications.length > 0 ? [...new Set(certifications)] : undefined,
    rawText: text,
    createdAt: new Date().toISOString(),
  };
  
  return resume;
}

// Parse file (PDF/DOCX/TXT)
export async function parseResumeFile(
  file: File,
  onProgress?: (progress: ParsingProgress) => void
): Promise<Resume> {
  onProgress?.({ stage: 'uploading', progress: 10, message: 'Reading file...' });
  
  let text = '';
  
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    text = await file.text();
  } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    // For PDF, we'll extract text client-side using a simple approach
    // In production, this would use pdf-parse on the server
    text = await extractTextFromPDF(file);
  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    // For DOCX, extract text client-side
    text = await extractTextFromDOCX(file);
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
  }
  
  if (!text || text.trim().length < 50) {
    throw new Error('Could not extract sufficient text from the file. Please try pasting your resume text directly.');
  }
  
  return parseResume(text, onProgress);
}

// Simple PDF text extraction (client-side fallback)
async function extractTextFromPDF(file: File): Promise<string> {
  // Read file as array buffer
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Simple text extraction from PDF (looks for text between parentheses and Tj operators)
  let text = '';
  let textBuffer = '';
  let inText = false;
  
  for (let i = 0; i < uint8Array.length; i++) {
    const char = String.fromCharCode(uint8Array[i]);
    
    if (char === '(' && !inText) {
      inText = true;
      textBuffer = '';
    } else if (char === ')' && inText) {
      inText = false;
      text += textBuffer + ' ';
    } else if (inText) {
      // Handle escape sequences
      if (char === '\\' && i + 1 < uint8Array.length) {
        const nextChar = String.fromCharCode(uint8Array[i + 1]);
        if (nextChar === 'n') {
          textBuffer += '\n';
          i++;
        } else if (nextChar === 'r') {
          textBuffer += '\r';
          i++;
        } else if (nextChar === 't') {
          textBuffer += '\t';
          i++;
        } else {
          textBuffer += nextChar;
          i++;
        }
      } else if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
        textBuffer += char;
      }
    }
  }
  
  // Clean up the text
  text = text
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, '')
    .trim();
  
  return text;
}

// Simple DOCX text extraction (client-side)
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // DOCX is a ZIP file, find document.xml content
  // This is a simplified extraction - in production use mammoth
  let text = '';
  
  // Convert to string and look for text content
  const decoder = new TextDecoder('utf-8', { fatal: false });
  const content = decoder.decode(uint8Array);
  
  // Extract text from XML tags
  const textMatches = content.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
  if (textMatches) {
    text = textMatches
      .map(match => match.replace(/<[^>]+>/g, ''))
      .join(' ');
  }
  
  return text.trim();
}
