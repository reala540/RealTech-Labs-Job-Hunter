import React from 'react';
import { 
  Upload, Search, Target, Zap, Shield, Globe, 
  ArrowRight, CheckCircle, Sparkles, TrendingUp,
  Building2, Users, Award, Clock
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Upload,
      title: 'Smart Resume Parsing',
      description: 'Upload your resume in PDF, DOCX, or paste text. Our AI extracts skills, experience, and qualifications automatically.',
      color: 'violet',
    },
    {
      icon: Search,
      title: 'Multi-Source Aggregation',
      description: 'Search across LinkedIn, Indeed, Glassdoor, RemoteOK, and company career pages in one place.',
      color: 'indigo',
    },
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Get personalized match scores based on your skills, experience, and career goals.',
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Real-Time Analysis',
      description: 'Instant skill gap analysis and recommendations to improve your match scores.',
      color: 'cyan',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays on your device. No cloud storage, no tracking, complete privacy.',
      color: 'emerald',
    },
    {
      icon: Globe,
      title: 'Remote-Friendly',
      description: 'Filter by remote, hybrid, or on-site positions. Find jobs that fit your lifestyle.',
      color: 'amber',
    },
  ];
  
  const stats = [
    { value: '30+', label: 'Jobs Matched', icon: Building2 },
    { value: '5', label: 'Job Sources', icon: Globe },
    { value: '12+', label: 'Filter Options', icon: Target },
    { value: '100%', label: 'Free & Local', icon: Shield },
  ];
  
  const howItWorks = [
    {
      step: 1,
      title: 'Upload Your Resume',
      description: 'Upload a PDF/DOCX file or paste your resume text directly.',
    },
    {
      step: 2,
      title: 'AI Analyzes Your Profile',
      description: 'Our AI extracts skills, experience, and qualifications from your resume.',
    },
    {
      step: 3,
      title: 'Search & Filter Jobs',
      description: 'Browse jobs from multiple sources with powerful filtering options.',
    },
    {
      step: 4,
      title: 'Get Matched Results',
      description: 'See personalized match scores and recommendations for each job.',
    },
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-8">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI-Powered Job Matching</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Job with{' '}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                AI-Powered Matching
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Upload your resume, search across multiple job boards, and get personalized match scores. 
              All powered by local AI - your data never leaves your device.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-lg hover:from-violet-600 hover:to-indigo-700 transition-all shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-lg hover:bg-slate-700 transition-colors"
              >
                Learn More
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              {['No Sign Up Required', 'Free Forever', '100% Privacy'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-slate-400">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful features designed to streamline your job search and maximize your chances of success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-500/10"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Get started in minutes with our simple four-step process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500" />
                )}
                
                <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white mb-4 mx-auto lg:mx-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 text-center lg:text-left">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm text-center lg:text-left">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 p-8 sm:p-12 overflow-hidden">
            {/* Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Find Your Next Opportunity?
              </h2>
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Upload your resume and start matching with jobs that align with your skills and experience. 
                It's free, private, and takes less than a minute.
              </p>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-xl bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition-colors shadow-xl flex items-center gap-2 mx-auto group"
              >
                Start Matching Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
