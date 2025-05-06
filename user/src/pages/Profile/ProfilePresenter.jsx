import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Skeleton } from '@/components/UI/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/UI/alert';
import EarnedCoins from '@/components/Profile/EarnedCoins';
import RedeemedPoints from '@/components/Profile/RedeemedPoints';
import ReferredMembers from '@/components/Profile/ReferredMembers';
import { 
  Coins, 
  Gift, 
  Link, 
  Settings, 
  Lock, 
  ChevronRight 
} from 'lucide-react';

const ProfilePresenter = ({ profile, pointsBalance, referralCode, isLoading, error }) => {
  const [activeSection, setActiveSection] = useState('coins');
  const [showEarnedCoins, setShowEarnedCoins] = useState(false);
  const [showRedeemedPoints, setShowRedeemedPoints] = useState(false);
  const [showReferredMembers, setShowReferredMembers] = useState(false);
  
  // Track which data has been fetched to prevent duplicate requests
  const dataFetched = useRef({
    coins: false,
    redeemed: false,
    referrals: false
  });
  
  // Control when to show components to prevent duplicate fetching
  useEffect(() => {
    if (activeSection === 'coins' && !isLoading) {
      if (!dataFetched.current.coins) {
        dataFetched.current.coins = true;
      }
      setShowEarnedCoins(true);
      setShowRedeemedPoints(false);
      setShowReferredMembers(false);
    } 
    else if ((activeSection === 'redeemed' || activeSection === 'rewards') && !isLoading) {
      if (!dataFetched.current.redeemed) {
        dataFetched.current.redeemed = true;
      }
      setShowRedeemedPoints(true);
      setShowEarnedCoins(false);
      setShowReferredMembers(false);
    }
    else if (activeSection === 'referrals' && !isLoading) {
      if (!dataFetched.current.referrals) {
        dataFetched.current.referrals = true;
      }
      setShowReferredMembers(true);
      setShowEarnedCoins(false);
      setShowRedeemedPoints(false);
    }
    else {
      setShowEarnedCoins(false);
      setShowRedeemedPoints(false);
      setShowReferredMembers(false);
    }
  }, [activeSection, isLoading]);
  
  // Reset loaded state when changing sections
  const handleSectionChange = (section) => {
    if (section !== activeSection) {
      setActiveSection(section);
    }
  };
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  // Profile header with user info and stats
  const ProfileHeader = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
          {profile?.fullname?.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile?.fullname || 'User'}</h2>
          <p className="text-muted-foreground">{profile?.email || 'No email provided'}</p>
        </div>
      </div>
      
      {/* Only show coin stats when activeSection is 'coins' */}
      {activeSection === 'coins' && (
        <div className="flex-1 grid grid-cols-2 gap-4 mt-4 md:mt-0">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-muted-foreground">Coin Earned</p>
            <p className="text-3xl font-bold text-primary">{pointsBalance?.total || 0}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-muted-foreground">Held Coins</p>
            <p className="text-3xl font-bold">{pointsBalance?.held || 0}</p>
          </div>
        </div>
      )}
    </div>
  );
  
  // Content area based on active section
  const ContentArea = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }
    
    switch (activeSection) {
      case 'coins':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Coin Earned</h2>
            <div className="bg-muted/30 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-3xl font-bold">{pointsBalance?.total || 0}</p>
                </div>
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Coins className="h-8 w-8 text-amber-500" />
                </div>
              </div>
            </div>
            
            {showEarnedCoins && (
              <EarnedCoins 
                skipFetching={dataFetched.current.coins} 
                existingData={pointsBalance}
              />
            )}
          </div>
        );
      case 'redeemed':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Redeemed Points</h2>
            {showRedeemedPoints && (
              <RedeemedPoints 
                skipFetching={dataFetched.current.redeemed}
              />
            )}
          </div>
        );
      case 'rewards':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Rewards</h2>
            {showRedeemedPoints && (
              <RedeemedPoints 
                skipFetching={dataFetched.current.redeemed}
              />
            )}
          </div>
        );
      // In the ContentArea component, case 'referrals':
      case 'referrals':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Members Referred</h2>
            {showReferredMembers && <ReferredMembers skipFetching={dataFetched.current.referrals} />}
          </div>
        );
      case 'settings':
        return <h2 className="text-2xl font-bold">Profile Settings</h2>;
      case 'password':
        return <h2 className="text-2xl font-bold">Change Password</h2>;
      default:
        return <div>Select a section</div>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <ProfileHeader />
      
      <div className="flex flex-col md:flex-row gap-6">
        <SidebarNav 
          activeSection={activeSection} 
          setActiveSection={handleSectionChange} 
          referralCode={referralCode} 
        />
        <div className="flex-1">
          <ContentArea />
        </div>
      </div>
    </div>
  );
};

// Sidebar navigation remains the same
const SidebarNav = ({ activeSection, setActiveSection, referralCode }) => {
  const navItems = [
    { id: 'coins', label: 'Coin Earned', icon: <Coins className="h-5 w-5" /> },
    { id: 'redeemed', label: 'Redeemed Points', icon: <Gift className="h-5 w-5" /> },
    { id: 'referrals', label: 'Members Referred', icon: <Link className="h-5 w-5" /> },
    { id: 'settings', label: 'Profile Setting', icon: <Settings className="h-5 w-5" /> },
    { id: 'password', label: 'Change Password', icon: <Lock className="h-5 w-5" /> },
  ];
  
  return (
    <div className="w-full md:w-64 mb-6 md:mb-0">
      <div className="space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
              activeSection === item.id 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 border rounded-lg">
        <p className="font-medium mb-2">Referral Code</p>
        <div className="flex items-center gap-2 bg-muted p-2 rounded">
          <code className="text-sm font-bold">{referralCode || ''}</code>
          <button 
            onClick={() => navigator.clipboard.writeText(referralCode || '')}
            className="ml-auto text-primary hover:text-primary/80"
            title="Copy to clipboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePresenter;