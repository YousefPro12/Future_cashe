import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Logo from './components/Logo';

// Placeholder components for routes
const Home = () => (
  <div className="max-w-4xl mx-auto text-center">
    <div className="flex justify-center mb-6">
      <Logo size="lg" />
    </div>
    <p className="text-xl mb-8">
      Earn rewards by completing offers, watching videos, and referring friends.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-3">Complete Offers</h2>
        <p className="text-muted-foreground">
          Earn points by completing sponsored offers from our partners.
        </p>
      </div>
      
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-3">Watch Videos</h2>
        <p className="text-muted-foreground">
          Get rewarded for watching videos and advertisements.
        </p>
      </div>
      
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border border-border">
        <h2 className="text-xl font-semibold mb-3">Refer Friends</h2>
        <p className="text-muted-foreground">
          Invite your friends and earn a bonus for each new user.
        </p>
      </div>
    </div>
    
    <div className="flex justify-center gap-4">
      <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium">
        Get Started
      </button>
      <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium">
        Learn More
      </button>
    </div>
  </div>
);

const Dashboard = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
    <p>Welcome to your dashboard. This is where you'll see your activity and earnings.</p>
  </div>
);

const NotFound = () => (
  <div className="text-center py-12">
    <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
    <p className="text-xl mb-6">Page not found</p>
    <a href="/" className="text-primary hover:underline">
      Go back home
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } 
        />
        <Route 
          path="*" 
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
