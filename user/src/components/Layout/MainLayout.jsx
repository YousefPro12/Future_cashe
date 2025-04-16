import React from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import Logo from '../Logo';
import { Link, Outlet } from 'react-router-dom';

/**
 * Main layout component for the application
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* Logo - automatically changes based on theme */}
            <Link to="/" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>
          
          {/* Navigation links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/earn" className="text-foreground hover:text-primary transition-colors">
              Earn
            </Link>
            <Link to="/videos" className="text-foreground hover:text-primary transition-colors">
              Videos
            </Link>
            <Link to="/rewards" className="text-foreground hover:text-primary transition-colors">
              Rewards
            </Link>
            <Link to="/referrals" className="text-foreground hover:text-primary transition-colors">
              Referrals
            </Link>
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
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-muted-foreground">
                Earn rewards by completing offers, watching videos, and referring friends.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/earn" className="text-muted-foreground hover:text-primary transition-colors">
                    Earn
                  </Link>
                </li>
                <li>
                  <Link to="/videos" className="text-muted-foreground hover:text-primary transition-colors">
                    Videos
                  </Link>
                </li>
                <li>
                  <Link to="/rewards" className="text-muted-foreground hover:text-primary transition-colors">
                    Rewards
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
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