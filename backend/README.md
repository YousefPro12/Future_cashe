# Future Cash Backend

This is the backend API server for the Future Cash rewards platform.

## Features

- User authentication with JWT
- Offer completion tracking
- Video rewards
- Referral system
- Rewards redemption
- Chat system
- Admin dashboard
- Analytics

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)

### Installation

1. Clone the repository and navigate to the backend directory
```
git clone https://github.com/yourusername/future-cash.git
cd future-cash/backend
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=futurecash
DB_PORT=3306

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_ADMIN_EXPIRES_IN=24h

# Frontend URL (for referral links)
FRONTEND_URL=http://localhost:3000
```

4. Run database migrations
```
npx sequelize-cli db:migrate
```

5. Start the development server
```
npm run dev
```

## API Documentation

The API endpoints are organized by controllers:

- `/api/auth` - Authentication routes
- `/api/user` - User profile and activity
- `/api/offers` - Offer wall and completion
- `/api/videos` - Video rewards
- `/api/rewards` - Rewards and redemption
- `/api/referrals` - Referral system
- `/api/chat` - Chat messages
- `/api/admin` - Admin dashboard

## Scheduled Tasks

The backend uses node-cron to schedule tasks:
- Daily stats generation at 1:00 AM

## Models

The database models include:
- User
- Admin
- Offer / OfferWall / OfferCompletion
- Video / VideoView
- RewardOption / RewardRedemption
- Referral
- ChatMessage
- UserActivity
- DailyStat
- And more...

## License

This project is licensed under the MIT License. 