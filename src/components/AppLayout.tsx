import React, { useState, useEffect } from 'react';
import { 
  Header, 
  Footer, 
  LandingPage, 
  UploadPage, 
  DashboardPage, 
  JobDetailPage 
} from './job-hunter';
import { useJobStore } from '@/hooks/useJobStore';

type Page = 'landing' | 'upload' | 'dashboard' | 'job-detail';

const AppLayout: React.FC = () => {
  const { resume, setResume, clearResume } = useJobStore();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Check for existing resume on mount
  useEffect(() => {
    if (resume) {
      // If user has a resume, they might want to go to dashboard
      // But we'll let them navigate manually
    }
  }, [resume]);
  
  const handleNavigate = (page: 'landing' | 'upload' | 'dashboard') => {
    setCurrentPage(page);
    setSelectedJobId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleJobClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setCurrentPage('job-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleResumeReady = (newResume: typeof resume) => {
    if (newResume) {
      setResume(newResume);
    }
  };
  
  const handleContinueToDashboard = () => {
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={() => handleNavigate('upload')} 
          />
        );
      
      case 'upload':
        return (
          <UploadPage
            onResumeReady={handleResumeReady}
            existingResume={resume}
            onClearResume={clearResume}
            onContinue={handleContinueToDashboard}
          />
        );
      
      case 'dashboard':
        if (!resume) {
          // Redirect to upload if no resume
          setCurrentPage('upload');
          return null;
        }
        return (
          <DashboardPage
            resume={resume}
            onJobClick={handleJobClick}
          />
        );
      
      case 'job-detail':
        if (!resume || !selectedJobId) {
          // Redirect to dashboard if no job selected
          setCurrentPage('dashboard');
          return null;
        }
        return (
          <JobDetailPage
            jobId={selectedJobId}
            resume={resume}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      
      default:
        return <LandingPage onGetStarted={() => handleNavigate('upload')} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        hasResume={!!resume}
      />
      
      <main>
        {renderPage()}
      </main>
      
      <Footer />
    </div>
  );
};

export default AppLayout;
