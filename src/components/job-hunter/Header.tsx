import React from 'react';
import { Briefcase, Upload, LayoutDashboard, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: 'landing' | 'upload' | 'dashboard' | 'job-detail';
  onNavigate: (page: 'landing' | 'upload' | 'dashboard') => void;
  hasResume: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, hasResume }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const navItems = [
    { id: 'landing' as const, label: 'Home', icon: Briefcase },
    { id: 'upload' as const, label: 'Upload Resume', icon: Upload },
    { id: 'dashboard' as const, label: 'Job Dashboard', icon: LayoutDashboard, requiresResume: true },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                RealTech Labs
              </span>
              <span className="text-xs text-slate-400 block -mt-1">Job Hunter</span>
            </div>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isDisabled = item.requiresResume && !hasResume;
              
              return (
                <button
                  key={item.id}
                  onClick={() => !isDisabled && onNavigate(item.id)}
                  disabled={isDisabled}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-violet-500/20 text-violet-300' 
                      : isDisabled
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          {/* Resume Status Badge */}
          <div className="hidden md:flex items-center gap-4">
            {hasResume ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Resume Active</span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('upload')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-medium hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
              >
                Get Started
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isDisabled = item.requiresResume && !hasResume;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isDisabled) {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-violet-500/20 text-violet-300' 
                      : isDisabled
                        ? 'text-slate-600 cursor-not-allowed'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.requiresResume && !hasResume && (
                    <span className="ml-auto text-xs text-slate-600">(Upload resume first)</span>
                  )}
                </button>
              );
            })}
            
            {/* Mobile Resume Status */}
            <div className="pt-4 border-t border-slate-800">
              {hasResume ? (
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400">Resume uploaded and active</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('upload');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-medium"
                >
                  Upload Your Resume
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
