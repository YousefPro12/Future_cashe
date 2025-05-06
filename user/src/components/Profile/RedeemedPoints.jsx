import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/UI/alert';
import { Badge } from '@/components/UI/badge';
import { 
  Gift, 
  RefreshCw, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { fetchRedemptionHistory } from '@/store/slices/rewardsSlice';

// Presenter component - responsible for rendering UI
const RedeemedPointsPresenter = ({ 
  redemptions, 
  loading, 
  error, 
  refreshing,
  onRefresh
}) => {
  // Loading state remains the same
  if (loading || refreshing) {
    return (
      <Card className="mb-6" variant="outline">
        <CardHeader>
          <CardTitle>Redeemed Points</CardTitle>
          <CardDescription>Your reward redemption history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading redemption history...</p>
        </CardContent>
      </Card>
    );
  }

  // Error state remains the same
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Helper function to render status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <RefreshCw className="h-3 w-3 mr-1" /> Processing
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" /> Completed
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format payment details for display
  const formatPaymentDetails = (paymentDetailsStr) => {
    try {
      const paymentData = JSON.parse(paymentDetailsStr);
      if (paymentData.payment_method) {
        const method = paymentData.payment_method.replace(/_/g, ' ');
        return `${method.charAt(0).toUpperCase() + method.slice(1)}`;
      }
      return 'Payment details available';
    } catch (e) {
      return 'Payment information';
    }
  };

  return (
    <Card className="mb-6" variant="outline">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Redeemed Points</CardTitle>
          <CardDescription>Your reward redemption history</CardDescription>
        </div>
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
        {redemptions && redemptions.length > 0 ? (
          <div className="space-y-4">
            {redemptions.map((redemption) => (
              // Inside your map function, update how you access the data
              <div key={redemption.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      {/* Try different ways to access the reward name */}
                      <h3 className="font-medium">
                        {redemption.RewardOption?.name || 
                         redemption.reward_name || 
                         `Reward #${redemption.reward_id}` || 
                         'Reward'}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(redemption.created_at || redemption.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {renderStatusBadge(redemption.status)}
                    <span className="text-sm font-medium">
                      {redemption.points_used} points
                    </span>
                  </div>
                </div>
                
                {redemption.admin_notes && (
                  <div className="mt-3 text-sm bg-muted/50 p-2 rounded">
                    <p className="font-medium">Admin Notes:</p>
                    <p>{redemption.admin_notes}</p>
                  </div>
                )}
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {redemption.payment_details && (
                      <span>
                        Payment: {formatPaymentDetails(redemption.payment_details)}
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8">
                    Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No redemptions found</h3>
            <p className="text-muted-foreground">
              You haven't redeemed any rewards yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Container component - simplified for better performance
const RedeemedPoints = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { token } = useSelector(state => state.auth);
  const { 
    redemptions = [], 
    loading: reduxLoading, 
    error: reduxError 
  } = useSelector(state => state.rewards);
  
  // Initial data fetching - with improved debugging
  useEffect(() => {

    if (token) {
     
      
      // Add more detailed logging
      dispatch(fetchRedemptionHistory({ page: 1, limit: 10 }))
        .then((action) => {
          
          // Check if we're getting data in the expected format
          if (action.payload && Array.isArray(action.payload.data)) {
            console.log('Redemption data found:', action.payload.data.length);
          } else if (action.payload && Array.isArray(action.payload)) {
            console.log('Redemption array found:', action.payload.length);
          } else {
            console.log('Unexpected payload format:', typeof action.payload);
          }
        })
        .catch((err) => {
          console.error('Error fetching redemptions:', err);
        });
    }
    
    // Set a timeout to ensure loading state doesn't hang
    const timer = setTimeout(() => {
      setLoading(false);
    }, 30);
    
    return () => clearTimeout(timer);
  }, [token, dispatch]);
  
  // Add this to debug the Redux state with more detail
  useEffect(() => {
   
    
    // Check if the data structure matches what your component expects
    if (redemptions && redemptions.length > 0) {
      console.log('Sample redemption item:', redemptions[0]);
      console.log('Has RewardOption?', !!redemptions[0].RewardOption);
      console.log('Has created_at?', !!redemptions[0].created_at);
      console.log('Has status?', !!redemptions[0].status);
    }
  }, [redemptions]);
  
  // Sync with Redux loading state
  useEffect(() => {
    if (reduxLoading === false) {
      setLoading(false);
    }
  }, [reduxLoading]);
  
  const handleRefresh = () => {
    if (refreshing || !token) return;
    
    setRefreshing(true);
    dispatch(fetchRedemptionHistory({ page: 1, limit: 10 }))
      .finally(() => {
        // Ensure refreshing state is reset even if there's an error
        setTimeout(() => setRefreshing(false), 1000);
      });
  };
  
  return (
    <RedeemedPointsPresenter
      redemptions={redemptions}
      loading={loading}
      error={reduxError}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default RedeemedPoints;