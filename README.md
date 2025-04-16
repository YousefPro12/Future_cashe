# Future Cash - Rewards Platform

A modern rewards platform built with React, Node.js, Express, and MySQL.

## Project Overview

This project is a conversion of a PHP rewards website to a modern React/Node.js application. Users can earn points by completing offers, watching videos, and referring friends. These points can then be redeemed for various rewards.

## Technology Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication

### Frontend (to be implemented)
- React
- Redux for state management
- React Router
- Shadcn ui with Tailwind CSS
- react hook form

## Database Improvements

The original database had several issues including:
- Heavy reliance on username-based identification
- Redundant data storage
- Lack of proper foreign key relationships
- Inconsistent data types and naming conventions

The new database schema addresses these issues with:
- Email-based authentication
- Properly normalized tables with foreign key relationships
- Consistent naming conventions and data types
- Better indexing strategy for performance

## Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/future-cash.git
cd future-cash
```

2. Install backend dependencies
```
cd backend
npm install
```

3. Configure environment variables
   - Copy `.env.example` to `.env`
   - Update the database connection details

4. Initialize the database
```
mysql -u root -p < improved-schema.sql
```

5. Start the development server
```
npm run dev
```

## Project Structure

```
future-cash/
├── backend/
│   ├── models/         # Sequelize models
│   ├── controllers/    # Route controllers
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   ├── package.json    # Backend dependencies
│   └── server.js       # Main server file
├── frontend/           # React frontend (to be implemented)
└── README.md           # Project documentation
```


----- WEBSITE STRUCTURE DETAILS -------
Future Cash Project Documentation
Backend Architecture
Core Components
1. Authentication System
Files:
/backend/controllers/authController.js
/backend/routes/authRoutes.js
/backend/middleware/authMiddleware.js
Functionality:
User registration with email verification
Login with JWT token generation
Password reset flow
Session management
Auth middleware for protected routes
Key Features:
Email-based authentication replacing username system
JWT token with refresh mechanism
Rate limiting for security
2. User Management
Files:
/backend/controllers/userController.js
/backend/routes/userRoutes.js
Functionality:
Profile management (view/update)
Activity history tracking
Points balance monitoring
IP tracking for fraud prevention
Data Flow:
User actions trigger activity logging
Activities update points balance
Profile endpoints provide summary data
3. Offer System
Files:
/backend/controllers/offerController.js
/backend/routes/offerRoutes.js
/backend/services/offerWallService.js
Functionality:
Fetch available offers from different offer walls
Complete offers and track status
Verify offer completions from external providers
Manage held offers (delayed rewards)
Business Logic:
Offer validation through provider callbacks
Fraud prevention with IP tracking
Points allocation based on offer value
4. Video System
Files:
/backend/controllers/videoController.js
/backend/routes/videoRoutes.js
Functionality:
List available videos
Track video views
Verify watch time
Award points for completed views
Business Logic:
Verify minimum watch time before awarding points
Prevent duplicate rewards for same video
Country-based video availability
5. Rewards System
Files:
/backend/controllers/rewardController.js
/backend/routes/rewardRoutes.js
Functionality:
List available rewards
Process redemption requests
Track redemption status
Verify point balance before redemption
Business Logic:
Point balance validation
Automated vs manual fulfillment process
Redemption status tracking
6. Referral System
Files:
/backend/controllers/referralController.js
/backend/routes/referralRoutes.js
/backend/services/referralService.js
Functionality:
Generate and track referral codes
Award points for successful referrals
View referral statistics
Business Logic:
Multi-tier referral rewards
Point allocation rules
Anti-fraud measures
7. Analytics System
Files:
/backend/services/analyticsService.js
/backend/controllers/adminController.js (for admin dashboard)
Functionality:
Track daily statistics
User activity monitoring
Performance metrics
Data Flow:
Daily aggregation jobs
Event-based tracking
Admin dashboard summary
8. Utility Services
Files:
/backend/utils/emailService.js
/backend/utils/ipService.js
/backend/utils/validationService.js
Functionality:
Email notifications
IP geolocation
Input validation
Common helper functions
API Structure
Public Endpoints
POST /api/auth/register      - Register new user
POST /api/auth/login         - User login
POST /api/auth/verify-email  - Email verification
POST /api/auth/forgot-password - Password reset request
POST /api/auth/reset-password  - Set new password

Apply to improved-sch...
Protected User Endpoints
GET  /api/user/profile        - Get user profile
PUT  /api/user/profile        - Update profile
GET  /api/user/activity       - Get user activity history
GET  /api/user/points         - Get points balance and history
GET  /api/user/referrals      - Get referral statistics

Apply to improved-sch...
Offer Endpoints
GET  /api/offers              - List available offers
GET  /api/offers/providers    - List offer providers
GET  /api/offers/:id          - Get offer details
POST /api/offers/complete     - Mark offer as complete
GET  /api/offers/history      - User's offer history


Video Endpoints
GET  /api/videos              - List available videos
GET  /api/videos/:id          - Get video details
POST /api/videos/view         - Record video view
GET  /api/videos/history      - User's video history

Reward Endpoints
GET  /api/rewards             - List available rewards
GET  /api/rewards/:id         - Get reward details
POST /api/rewards/redeem      - Redeem points for reward
GET  /api/rewards/history     - Redemption history

Chat Endpoints
GET  /api/chat/messages       - Get chat messages
POST /api/chat/messages       - Post new message


Frontend Architecture
Core Components
1. Authentication Module
Files:
/frontend/src/features/auth/LoginPage.jsx
/frontend/src/features/auth/RegisterPage.jsx
/frontend/src/features/auth/ForgotPasswordPage.jsx
/frontend/src/features/auth/ResetPasswordPage.jsx
/frontend/src/features/auth/authSlice.js (Redux)
Functionality:
User registration forms
Login interface
Password reset workflow
Session management
2. Dashboard Module
Files:
/frontend/src/features/dashboard/DashboardPage.jsx
/frontend/src/features/dashboard/PointsSummary.jsx
/frontend/src/features/dashboard/ActivityFeed.jsx
/frontend/src/features/dashboard/dashboardSlice.js (Redux)
Functionality:
Main user dashboard
Points summary
Recent activity
Quick access to main features
3. Offer Wall Module
Files:
/frontend/src/features/offers/OffersPage.jsx
/frontend/src/features/offers/OfferWallList.jsx
/frontend/src/features/offers/OfferCard.jsx
/frontend/src/features/offers/OfferDetail.jsx
/frontend/src/features/offers/offersSlice.js (Redux)
Functionality:
Display offer walls
Filter and sort offers
Offer details view
Offer completion tracking
4. Video Module
Files:
/frontend/src/features/videos/VideosPage.jsx
/frontend/src/features/videos/VideoPlayer.jsx
/frontend/src/features/videos/VideoCard.jsx
/frontend/src/features/videos/videosSlice.js (Redux)
Functionality:
Video browsing interface
Video player with tracking
Video rewards system
5. Rewards Module
Files:
/frontend/src/features/rewards/RewardsPage.jsx
/frontend/src/features/rewards/RewardCard.jsx
/frontend/src/features/rewards/RedemptionForm.jsx
/frontend/src/features/rewards/RedemptionHistory.jsx
/frontend/src/features/rewards/rewardsSlice.js (Redux)
Functionality:
Browse available rewards
Redemption process
Redemption history
Status tracking
6. Referral Module
Files:
/frontend/src/features/referrals/ReferralPage.jsx
/frontend/src/features/referrals/ReferralStats.jsx
/frontend/src/features/referrals/ReferralLink.jsx
/frontend/src/features/referrals/referralsSlice.js (Redux)
Functionality:
Referral link generation
Social sharing tools
Referral statistics
Earnings tracking
7. Profile Module
Files:
/frontend/src/features/profile/ProfilePage.jsx
/frontend/src/features/profile/ProfileForm.jsx
/frontend/src/features/profile/SecuritySettings.jsx
/frontend/src/features/profile/profileSlice.js (Redux)
Functionality:
Profile management
Security settings
Account preferences
8. Chat Module
Files:
/frontend/src/features/chat/ChatPage.jsx
/frontend/src/features/chat/ChatWindow.jsx
/frontend/src/features/chat/ChatInput.jsx
/frontend/src/features/chat/chatSlice.js (Redux)
Functionality:
Live chat interface
Message history
User interactions
Shared Components
Files:
/frontend/src/components/Layout/ - Layout components
/frontend/src/components/UI/ - Reusable shadcn UI elements
/frontend/src/components/Navigation/ - Navigation elements
Services & Utils
Files:
/frontend/src/services/api.js - API client
/frontend/src/utils/validation.js - Form validation
/frontend/src/utils/formatters.js - Data formatters
State Management
Files:
/frontend/src/store/index.js - Redux store configuration
/frontend/src/hooks/ - Custom React hooks
Data Flow & Business Logic
User Registration Flow
User submits registration form with email
Backend validates email and creates user record
OTP code sent to email
User verifies email with OTP
Account activated, referral code generated
If referred by another user, referral relationship created
Offer Completion Flow
User selects offer from list
User redirected to offer URL with tracking parameters
User completes offer on external site
External provider sends callback to API
System validates completion (IP, fraud check)
Offer marked as completed or held depending on rules
Points awarded to user if approved
Activity recorded in user history
Video Completion Flow
User selects video to watch
Video player tracks watch time
When watch time meets threshold, user earns points
System checks for duplicate views
Points awarded and activity recorded
Reward Redemption Flow
User selects reward to redeem
System validates point balance
User provides payment details
Points deducted, redemption recorded
Admin notified for manual processing
Status updated as processing occurs
Completion notification when fulfilled
Referral System Flow
User shares referral link
New user registers using link
Referral relationship established
When referred user completes qualifying action
Referring user earns referral bonus
Activity and earnings recorded for both users
Technical Considerations
Security Measures
JWT token-based authentication
IP tracking for fraud prevention
Rate limiting on sensitive endpoints
Input validation on all user inputs
XSS and CSRF protection
Performance Optimization
Database indexing for common queries
Pagination for large data sets
Caching for frequently accessed data
Optimized API responses with selective data
Scalability Considerations
Modular architecture for easy extension
Separation of concerns between services
Queue-based processing for high-volume operations
Stateless API design for horizontal scaling
Mobile Responsiveness
Fluid layout design
Touch-friendly UI elements
Progressive image loading
Reduced network payload for mobile
Development Workflow
Backend API endpoints first approach
Component-based frontend development
Feature branch workflow
Integration testing for critical flows
Continuous deployment pipeline
This documentation provides a comprehensive blueprint for the Future Cash application, with a clear separation of concerns between backend services and frontend components. Each module is designed to handle specific business requirements while maintaining scalability and maintainability.


## License

This project is licensed under the MIT License.
