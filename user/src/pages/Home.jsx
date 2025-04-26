import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { SignupForm } from '@/components/Auth';

/**
 * Home page component
 */
const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-center mb-6">
        <Logo size="large" />
      </div>
      
      {/* Hero Section with Two Columns */}
      <div className="flex flex-col lg:flex-row items-center gap-10 mb-16">
        {/* Left Column - Value Proposition */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Earn Rewards for Your Activities</h1>
          <p className="text-xl mb-6">
            Earn points by completing offers, watching videos, and referring friends.
          </p>
          
          <div className="hidden lg:flex gap-4">
            <button 
              onClick={() => navigate('/earn')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
            >
              Learn More
            </button>
          </div>
        </div>
        
        {/* Right Column - Signup Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-card rounded-xl shadow-lg border border-border p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
            <SignupForm />
          </div>
        </div>
      </div>
      
      {/* Mobile Buttons */}
      <div className="flex lg:hidden justify-center gap-4 mb-12">
        <button 
          onClick={() => navigate('/earn')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
        >
          Get Started
        </button>
        <button 
          onClick={() => navigate('/about')}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
        >
          Learn More
        </button>
      </div>

      {/* Features Section */}
      <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Complete Offers</h3>
          <p className="text-muted-foreground mb-4">
            Earn points by completing sponsored offers from our partners.
          </p>
          <button 
            onClick={() => navigate('/earn')}
            className="text-primary hover:underline inline-block"
          >
            View Offers →
          </button>
        </div>
        
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Watch Videos</h3>
          <p className="text-muted-foreground mb-4">
            Get rewarded for watching videos and advertisements.
          </p>
          <button 
            onClick={() => navigate('/videos')}
            className="text-primary hover:underline inline-block"
          >
            Watch Videos →
          </button>
        </div>
        
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-semibold mb-3">Refer Friends</h3>
          <p className="text-muted-foreground mb-4">
            Invite your friends and earn a bonus for each new user.
          </p>
          <button 
            onClick={() => navigate('/referrals')}
            className="text-primary hover:underline inline-block"
          >
            Refer Friends →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 