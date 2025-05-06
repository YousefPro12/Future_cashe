import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/UI/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/UI/table';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { 
  RefreshCw, 
  AlertCircle, 
  Users
} from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/UI/alert';
import { fetchReferrals, fetchReferralStats } from '@/store/slices/referralsSlice';

// Presenter component - responsible for rendering UI
const ReferredMembersPresenter = ({ 
  referrals, 
  stats,
  loading, 
  error, 
  onRefresh,
  refreshing
}) => {
  if (loading || refreshing) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Referred Members</CardTitle>
          <CardDescription>People you've referred to LightCash</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading referrals...</p>
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

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Referred Members</CardTitle>
          <CardDescription>People you've referred to LightCash</CardDescription>
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
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Referrals</p>
            <p className="text-2xl font-bold">{stats.total_referrals || 0}</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Active Referrals</p>
            <p className="text-2xl font-bold">{stats.active_referrals || 0}</p>
          </div>
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold">{stats.total_earnings || 0} points</p>
          </div>
        </div>

        {/* Referrals Table */}
        {referrals.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Points Earned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <div className="font-medium">{referral.referred?.fullname || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{referral.referred?.email || 'No email'}</div>
                  </TableCell>
                  <TableCell>{formatDate(referral.referred?.created_at || referral.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={referral.status === 'active' ? 'success' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {referral.points_earned} points
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No referrals yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't referred anyone to LightCash yet.
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              Share your referral link with friends and earn points when they join and complete activities.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Container component - simplified to only fetch and display referrals
const ReferredMembers = ({ skipFetching }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);

  // Get data from Redux store
  const { 
    referrals, 
    stats, 
    loading: { referrals: loading }, 
    error 
  } = useSelector((state) => state.referrals);

  // Fetch referrals on component mount, but only if not skipping
  useEffect(() => {
    if (!skipFetching) {
      dispatch(fetchReferrals());
      dispatch(fetchReferralStats());
    }
  }, [dispatch, skipFetching]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchReferrals());
    await dispatch(fetchReferralStats());
    setRefreshing(false);
  };

  return (
    <ReferredMembersPresenter
      referrals={referrals}
      stats={stats}
      loading={loading && !skipFetching}
      error={error}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );
};

export default ReferredMembers;