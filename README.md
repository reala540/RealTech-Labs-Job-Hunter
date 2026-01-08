# RealTech Labs Job Hunter

AI-Powered Resume-to-Job Matching SaaS Platform

## Overview

RealTech Labs Job Hunter is a production-ready, AI-powered job matching platform that analyzes your resume and matches you with relevant job opportunities from multiple sources. All processing happens locally in your browser - your data never leaves your device.

## Features

### Resume Pipeline
- **Upload or Paste**: Support for PDF, DOCX, and plain text resumes
- **Smart Parsing**: Automatic extraction of contact info, skills, experience, and education
- **Local Processing**: All parsing happens client-side for complete privacy
- **Structured Data**: Converts resumes to normalized JSON format

### Job Acquisition
- **Multi-Source Aggregation**: Searches across 5 job sources simultaneously
- **Adapter Pattern**: Modular connectors for each job source
- **Normalized Schema**: All jobs converted to standard format for consistent matching

#### Job Source Adapters
1. **LinkedIn** (Mock/Restricted)
   - Mock connector for development
   - Disabled scraper abstraction (ToS compliant)
   
2. **Indeed**
   - Job listings from Indeed
   - Mock data with real schema
   
3. **Glassdoor**
   - Senior/executive focused listings
   - Mock data with real schema
   
4. **RemoteOK**
   - Remote-first job listings
   - API abstraction available
   
5. **Company Career Pages**
   - Direct company listings
   - Top tech companies included

### AI Matching Engine
- **Skill Matching**: Compares resume skills against job requirements
- **Experience Analysis**: Evaluates years of experience and seniority fit
- **Keyword Scoring**: TF-IDF-like keyword relevance scoring
- **Location Matching**: Considers remote/hybrid/onsite preferences
- **Explainable Results**: Detailed breakdown of match scores

### Filtering System (12+ Filters)
1. Role/Title
2. Location
3. Remote/Hybrid/Onsite
4. Salary Range (Min/Max)
5. Seniority Level
6. Job Type
7. Company
8. Keywords
9. Job Sources
10. Posted Within
11. Minimum Match Score
12. Skills

### Frontend Pages
1. **Landing Page**: Hero section, features, how it works, CTA
2. **Upload Page**: Resume upload/paste with progress UI
3. **Dashboard**: Job results with filters and search
4. **Job Detail**: Full job info with match analysis

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Lucide Icons
- date-fns

### State Management
- Custom job store with localStorage persistence
- React hooks for state access

### Resume Parsing
- Client-side PDF text extraction
- Client-side DOCX text extraction
- Pattern-based skill and experience extraction

### AI/ML
- Local TF-IDF-like embedding generation
- Cosine similarity for matching
- No external API dependencies

## Project Structure

```
src/
├── adapters/           # Job source adapters
│   ├── base-adapter.ts
│   ├── linkedin-adapter.ts
│   ├── indeed-adapter.ts
│   ├── glassdoor-adapter.ts
│   ├── remoteok-adapter.ts
│   ├── company-adapter.ts
│   └── adapter-registry.ts
├── components/
│   └── job-hunter/     # Main UI components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── JobCard.tsx
│       ├── JobFilters.tsx
│       ├── ResumeUploader.tsx
│       ├── MatchBreakdown.tsx
│       ├── LandingPage.tsx
│       ├── UploadPage.tsx
│       ├── DashboardPage.tsx
│       ├── JobDetailPage.tsx
│       └── index.ts
├── hooks/
│   └── useJobStore.ts  # Job store React hook
├── lib/
│   ├── resume-parser.ts    # Resume parsing logic
│   ├── matching-engine.ts  # AI matching algorithms
│   └── job-store.ts        # State management
├── types/
│   └── index.ts        # TypeScript types & Zod schemas
└── pages/
    └── Index.tsx       # Main entry point
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

No environment variables required - all processing is local.

## Privacy

- All resume parsing happens in your browser
- No data is sent to external servers
- Resume data is stored in localStorage (optional)
- You can clear all data at any time

## Extending Job Sources

To add a new job source:

1. Create a new adapter in `src/adapters/`:

```typescript
import { BaseJobAdapter } from './base-adapter';
import { Job, JobFilter } from '@/types';

export class NewSourceAdapter extends BaseJobAdapter {
  name = 'NewSource';
  enabled = true;
  isRestricted = false;
  
  async fetchJobs(query: string, filters?: Partial<JobFilter>): Promise<Job[]> {
    // Implement job fetching logic
  }
  
  async getJobById(id: string): Promise<Job | null> {
    // Implement single job fetching
  }
}

export const newSourceAdapter = new NewSourceAdapter();
```

2. Register in `src/adapters/adapter-registry.ts`:

```typescript
import { newSourceAdapter } from './new-source-adapter';

// In constructor:
this.registerAdapter(newSourceAdapter);
```

## Match Score Calculation

The match score is calculated using weighted components:

| Component | Weight |
|-----------|--------|
| Skills Match | 35% |
| Experience Match | 25% |
| Keyword Match | 20% |
| Location Match | 10% |
| Seniority Match | 10% |

## License

MIT License

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## Support

For issues and feature requests, please use the GitHub issue tracker.
