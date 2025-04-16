import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/UI/card';

/**
 * Dashboard page component
 */
const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            View your earnings, activity, and rewards.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link 
            to="/earn"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Earn Points
          </Link>
          <Link 
            to="/rewards"
            className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground ring-offset-background transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Redeem Points
          </Link>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Points Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">
              +180 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground">
              Available in 3 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent point earning and redemption activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'earned', source: 'Completed Survey XYZ', amount: 100, date: '2 hours ago' },
              { type: 'redeemed', source: '$10 Amazon Gift Card', amount: 1000, date: '2 days ago' },
              { type: 'earned', source: 'Mobile Game Install', amount: 250, date: '3 days ago' },
              { type: 'earned', source: 'Watched Video', amount: 25, date: '5 days ago' },
              { type: 'earned', source: 'Referral Bonus', amount: 500, date: '1 week ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activity.type === 'earned' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <div>
                    <div className="font-medium">{activity.source}</div>
                    <div className="text-sm text-muted-foreground">{activity.date}</div>
                  </div>
                </div>
                <div className={`font-medium ${activity.type === 'earned' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {activity.type === 'earned' ? '+' : '-'}{activity.amount} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link 
            to="/activity"
            className="text-sm text-primary hover:underline"
          >
            View all activity →
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard; 