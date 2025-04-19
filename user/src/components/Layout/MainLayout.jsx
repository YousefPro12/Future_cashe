import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import Logo from '@/components/Logo';
import { routes, mainNavRoutes, supportRoutes } from '@/routesConfig';
import useAuth from '@/hooks/useAuth';

/**
 * Main layout component for the application
 */
const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  
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
            
            {/* User menu with dropdown */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-full transition-colors"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              >
                <span className="text-foreground">
                  {isAuthenticated && user ? user.fullname || user.email : 'Account'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {/* Account dropdown menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-20 border border-border">
                  {isAuthenticated ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => goTo('/login')}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => goTo('/register')}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
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
    </div>
  );
};

export default MainLayout; 