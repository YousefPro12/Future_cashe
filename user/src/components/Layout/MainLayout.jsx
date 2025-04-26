import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Logo from '@/components/Logo';
import { routes, mainNavRoutes, supportRoutes } from '@/routesConfig';
import useAuth from '@/hooks/useAuth';
import { Popup } from '@/components/common';
import { LoginForm, SignupForm } from '@/components/Auth';

/**
 * Main layout component for the application
 */
const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  
  const goTo = (path) => {
    setIsAccountMenuOpen(false);
    navigate(path);
  };
  
  const handleLogout = () => {
    setIsAccountMenuOpen(false);
    logout();
  };
  
  // Check if a path is active
  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };
  
  // Get main navigation items
  const navItems = mainNavRoutes.map(key => routes[key]);
  
  // Get support navigation items
  const supportItems = supportRoutes.map(key => routes[key]);

  // Handle successful login/signup
  const handleAuthSuccess = () => {
    setShowLoginPopup(false);
    setShowSignupPopup(false);
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
            {navItems.map((item) => (
              <button 
                key={item.path}
                onClick={() => goTo(item.path)} 
                className={`transition-colors ${
                  isActivePath(item.path) 
                    ? 'text-primary font-medium' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            
            {/* Authentication buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-full transition-colors"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                >
                  <span className="text-foreground">
                    {user ? user.fullname || user.email : 'Account'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {/* Account dropdown menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-20 border border-border">
                    <button
                      onClick={() => goTo(routes.account.path)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      My Account
                    </button>
                    <div className="border-t border-border my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLoginPopup(true)}
                  className="text-foreground hover:text-primary transition-colors px-3 py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowSignupPopup(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
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
                {navItems.map((item) => (
                  <li key={item.path}>
                    <button 
                      onClick={() => goTo(item.path)} 
                      className={`${
                        isActivePath(item.path) 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-primary'
                      } transition-colors`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={() => goTo(routes.apiTest.path)} 
                    className={`${
                      isActivePath(routes.apiTest.path) 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-primary'
                    } transition-colors`}
                  >
                    {routes.apiTest.label}
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {supportItems.map((item) => (
                  <li key={item.path}>
                    <button 
                      onClick={() => goTo(item.path)} 
                      className={`${
                        isActivePath(item.path) 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-primary'
                      } transition-colors`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Lightcash. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Popup */}
      <Popup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        title="Welcome Back"
        size="md"
      >
        <div className="p-4">
          <div className="mb-4 text-center">
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <LoginForm onSuccess={handleAuthSuccess} />
          <div className="mt-6 text-center">
            <button
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                setShowLoginPopup(false);
                setShowSignupPopup(true);
              }}
            >
              Don't have an account? <span className="font-medium text-primary">Sign up</span>
            </button>
          </div>
        </div>
      </Popup>

      {/* Signup Popup */}
      <Popup
        isOpen={showSignupPopup}
        onClose={() => setShowSignupPopup(false)}
        title="Create Your Account"
        size="md"
      >
        <div className="p-4">
          <div className="mb-4 text-center">
            <p className="text-muted-foreground">Join our community and start earning rewards</p>
          </div>
          <SignupForm onSuccess={handleAuthSuccess} />
          <div className="mt-6 text-center">
            <button
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              onClick={() => {
                setShowSignupPopup(false);
                setShowLoginPopup(true);
              }}
            >
              Already have an account? <span className="font-medium text-primary">Sign in</span>
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default MainLayout; 