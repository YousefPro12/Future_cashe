import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../UI/card';
import { Button } from '../UI/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../UI/tabs';
import api from '../../services/api';

/**
 * OfferWallsView component displays available offer providers
 * and their related offers
 */
const OfferWallsView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [offerWalls, setOfferWalls] = useState([]);
  const [selectedWall, setSelectedWall] = useState(null);
  const [error, setError] = useState(null);

  // Fetch offer walls on component mount
  useEffect(() => {
    const fetchOfferWalls = async () => {
      try {
        setIsLoading(true);
        const response = await api.offers.getProviders();
        
        // Ensure the providers data is an array
        const providers = Array.isArray(response) ? response : 
                         (response && response.data && Array.isArray(response.data)) ? response.data : [];
        
        console.log('Offer Walls Response:', response);
        console.log('Processed Providers:', providers);
        
        setOfferWalls(providers);
        
        // Set the first provider as selected by default if available
        if (providers.length > 0) {
          setSelectedWall(providers[0].id);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load offer providers. Please try again later.');
        console.error('Error fetching offer walls:', err);
        // Initialize with empty array to prevent map errors
        setOfferWalls([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferWalls();
  }, []);

  // Open offer in new window when clicked
  const handleOfferClick = (offer) => {
    // Track click before opening
    try {
      // Optional: track offer click
      // api.offers.trackClick(offer.id);
      
      // Open offer in new window
      window.open(offer.offer_url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Error opening offer:', err);
    }
  };

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Offers & Earn Rewards</h1>
      <p className="text-muted-foreground mb-8">
        Select an offer provider below and complete tasks to earn points.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full h-40 animate-pulse">
              <CardContent className="h-full flex items-center justify-center">
                <div className="w-full h-8 bg-muted rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Offer Wall Tabs */}
          {Array.isArray(offerWalls) && offerWalls.length > 0 ? (
            <Tabs
              defaultValue={offerWalls[0]?.id?.toString()}
              value={selectedWall?.toString()}
              onValueChange={(value) => setSelectedWall(parseInt(value))}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {offerWalls.map((wall) => (
                  <TabsTrigger 
                    key={wall.id} 
                    value={wall.id.toString()}
                    className="relative flex flex-col items-center gap-1 py-3"
                  >
                    {wall.image_url && (
                      <img 
                        src={wall.image_url} 
                        alt={`${wall.name} icon`} 
                        className="w-6 h-6 object-contain" 
                      />
                    )}
                    <span>{wall.name}</span>
                    {wall.featured && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-1 rounded-full">
                        Hot
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Offers for each wall */}
              {offerWalls.map((wall) => (
                <TabsContent key={wall.id} value={wall.id.toString()} className="mt-6">
                  <OfferWallContent 
                    providerId={wall.id} 
                    providerName={wall.name}
                    onOfferClick={handleOfferClick} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No offer providers available at the moment.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * OfferWallContent component displays offers from a specific provider
 */
const OfferWallContent = ({ providerId, providerName, onOfferClick }) => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const response = await api.offers.getByProvider(providerId);
        
        // Ensure the offers data is an array
        const data = Array.isArray(response) ? response : 
                    (response && response.data && Array.isArray(response.data)) ? response.data : [];
        
        console.log(`Offers for provider ${providerId}:`, response);
        console.log('Processed Offers:', data);
        
        setOffers(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load offers from ${providerName}`);
        console.error(`Error fetching offers for provider ${providerId}:`, err);
        // Initialize with empty array to prevent map errors
        setOffers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [providerId, providerName]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="w-full h-64 animate-pulse">
            <CardContent className="h-full flex flex-col justify-between p-6">
              <div className="w-full h-24 bg-muted rounded-md"></div>
              <div className="w-2/3 h-4 bg-muted rounded-md"></div>
              <div className="w-1/2 h-8 bg-muted rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(offers) && offers.length > 0 ? (
          offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{offer.title}</CardTitle>
                <CardDescription className="line-clamp-2">{offer.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                {offer.image_url && (
                  <img 
                    src={offer.image_url} 
                    alt={offer.title} 
                    className="rounded-md w-full h-32 object-cover mb-3" 
                  />
                )}
                {(offer.countries || offer.category) && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    {offer.category && (
                      <span className="flex items-center gap-1">
                        <CategoryIcon />
                        {offer.category}
                      </span>
                    )}
                    {offer.countries && (
                      <span className="flex items-center gap-1">
                        <GlobeIcon />
                        {Array.isArray(offer.countries) 
                          ? offer.countries.join(', ') 
                          : offer.countries.split(',')[0] + (offer.countries.split(',').length > 1 ? ' +' + (offer.countries.split(',').length - 1) : '')}
                      </span>
                    )}
                  </div>
                )}
                {offer.instructions && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>How to complete:</strong> {offer.instructions}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between items-center">
                <div className="font-bold text-primary">
                  {offer.points} pts
                </div>
                <Button 
                  onClick={() => onOfferClick(offer)}
                  className="gap-1"
                >
                  Complete <ArrowRightIcon />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">
              No offers available from this provider at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Icon components
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14H4"></path>
    <path d="M4 4h16"></path>
    <path d="M4 9h16"></path>
    <path d="M4 19h16"></path>
  </svg>
);

export default OfferWallsView; 