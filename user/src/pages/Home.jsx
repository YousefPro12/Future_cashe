import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

/**
 * Home page component
 */
const Home = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <Logo size="large" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Earn Rewards for Your Activities</h1>
      <p className="text-xl mb-8">
        Earn points by completing offers, watching videos, and referring friends.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Complete Offers</h2>
          <p className="text-muted-foreground mb-4">
            Earn points by completing sponsored offers from our partners.
          </p>
          <Link 
            to="/earn" 
            className="text-primary hover:underline inline-block"
          >
            View Offers →
          </Link>
        </div>
        
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Watch Videos</h2>
          <p className="text-muted-foreground mb-4">
            Get rewarded for watching videos and advertisements.
          </p>
          <Link 
            to="/videos" 
            className="text-primary hover:underline inline-block"
          >
            Watch Videos →
          </Link>
        </div>
        
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
          <h2 className="text-xl font-semibold mb-3">Refer Friends</h2>
          <p className="text-muted-foreground mb-4">
            Invite your friends and earn a bonus for each new user.
          </p>
          <Link 
            to="/referrals" 
            className="text-primary hover:underline inline-block"
          >
            Refer Friends →
          </Link>
        </div>
      </div>
      
      <div className="flex justify-center gap-4">
        <Link 
          to="/earn" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
        >
          Get Started
        </Link>
        <Link 
          to="/about" 
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default Home; 