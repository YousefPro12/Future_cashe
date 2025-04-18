import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Logo from '@/components/Logo';

/**
 * Main layout component for the application
 */
const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  
  const goTo = (path) => {
    navigate(path);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Logo - automatically changes based on theme */}
            <button 
              className="flex items-center" 
              onClick={() => goTo('/')}
            >
              <Logo size="small" />
            </button>
          </div>
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => goTo('/dashboard')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </button>
            <button 
              onClick={() => goTo('/earn')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Earn
            </button>
            <button 
              onClick={() => goTo('/videos')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Videos
            </button>
            <button 
              onClick={() => goTo('/rewards')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Rewards
            </button>
            <button 
              onClick={() => goTo('/referrals')} 
              className="text-foreground hover:text-primary transition-colors"
            >
              Referrals
            </button>
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            
            {/* User menu (simplified) */}
            <div className="relative">
              <button className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-full transition-colors">
                <span className="text-foreground">Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content - uses Outlet from react-router */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <button onClick={() => goTo('/')}>
                  <Logo size="small" />
                </button>
              </div>
              <p className="text-muted-foreground">
                Earn rewards by completing offers, watching videos, and referring friends.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => goTo('/dashboard')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/earn')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Earn
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/videos')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Videos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/rewards')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Rewards
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/api-test')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    API Test
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => goTo('/help')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/contact')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/terms')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => goTo('/privacy')} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Lightcash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 