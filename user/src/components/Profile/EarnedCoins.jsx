import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Skeleton } from '@/components/UI/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/UI/alert';
import { Separator } from '@/components/UI/separator';
import { Badge } from '@/components/UI/badge';
import {
  Trophy,
  History,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { fetchUserPoints, fetchUserActivity } from '@/store/slices/userSlice';

// Presenter component - responsible for rendering UI
const EarnedCoinsPresenter = ({ 
  pointsData, 
  pointsActivity, 
  loading, 
  error, 
  refreshing, 
  onRefresh 
}) => {
  if (loading || refreshing) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Earnings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading points data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Your Earnings</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={refreshing}
          className="h-8"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-3xl font-bold text-primary">{pointsData?.points_balance || 0}</p>
          </div>
          <Trophy className="h-8 w-8 text-amber-500" />
        </div>

        <Separator className="my-4" />
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <History className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Recent Activity</h3>
          </div>
          
          {pointsActivity && pointsActivity.length > 0 ? (
            <div className="space-y-3">
              {pointsActivity.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className={`flex items-center ${item.points_change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.points_change > 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +{item.points_change}
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 mr-1" />
                        {item.points_change}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No recent activity</p>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap gap-2 justify-between">
          <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-800">
            Offers: {pointsData?.points_from_offers || 0}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 hover:bg-green-100 text-green-800">
            Videos: {pointsData?.points_from_videos || 0}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 hover:bg-purple-100 text-purple-800">
            Referrals: {pointsData?.points_from_referrals || 0}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Container component - responsible for data fetching and state management
// Update the EarnedCoins component to accept these props
const EarnedCoins = ({ existingData, skipFetching = false }) => {
  const dispatch = useDispatch();
  const { pointsData, userActivity, loading, error } = useSelector(state => state.user);
  const [refreshing, setRefreshing] = useState(false);
  
  // Use existing data if provided
  const displayData = existingData || pointsData;
  
  // Filter activity to only show points-related entries
  const pointsActivity = userActivity?.filter(activity => 
    activity.points_change !== undefined && activity.points_change !== 0
  )?.slice(0, 5) || []; // Add fallback empty array
  
  // Update the useEffect to prevent repeated fetching
  useEffect(() => {
    // Only fetch if not skipping and data isn't already loaded
    if (!skipFetching && (!pointsData || !userActivity || userActivity.length === 0)) {
      try {
        dispatch(fetchUserPoints());
        dispatch(fetchUserActivity());
      } catch (err) {
        console.error("Error fetching data:", err);
      }

    }
    // Remove pointsData and userActivity from the dependency array to prevent re-fetching
  }, [dispatch, skipFetching]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchUserPoints()),
      dispatch(fetchUserActivity())
    ]).finally(() => {
      setRefreshing(false);
    });
  };
  
  // Pass data and callbacks to the presenter component
  return (
    <EarnedCoinsPresenter
      pointsData={displayData}
      pointsActivity={pointsActivity}
      loading={loading?.points || loading?.activity}
      error={error}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default EarnedCoins;