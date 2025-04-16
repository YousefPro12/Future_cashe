import React from 'react';
import { OfferWallsView } from '../components/Offerwalls';

/**
 * Earn page component
 * This page displays various ways to earn rewards including offer walls
 */
const Earn = () => {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Earn Rewards</h1>
        <p className="text-muted-foreground text-lg">
          Complete offers, participate in surveys, and more to earn points that can be
          redeemed for rewards.
        </p>
      </div>
      
      {/* Offer Walls Section */}
      <div className="mt-8">
        <OfferWallsView />
      </div>
    </div>
  );
};

export default Earn; 