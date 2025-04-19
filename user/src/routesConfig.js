// Routes configuration for the application
export const routes = {
  dashboard: {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'faTachometerAlt'
  },
  earn: {
    path: '/earn',
    label: 'Earn',
    icon: 'faCoins'
  },
  videos: {
    path: '/videos',
    label: 'Videos',
    icon: 'faVideo'
  },
  rewards: {
    path: '/rewards',
    label: 'Rewards',
    icon: 'faGift'
  },
  referrals: {
    path: '/referrals',
    label: 'Referrals',
    icon: 'faUserFriends'
  },
  help: {
    path: '/help',
    label: 'Help Center',
    icon: 'faQuestionCircle'
  },
  contact: {
    path: '/contact',
    label: 'Contact Us',
    icon: 'faEnvelope'
  },
  account: {
    path: '/account',
    label: 'Account',
    icon: 'faUserCircle'
  },
  apiTest: {
    path: '/api-test',
    label: 'API Test',
    icon: 'faCode'
  },
  terms: {
    path: '/terms',
    label: 'Terms of Service',
    icon: 'faFileContract'
  },
  privacy: {
    path: '/privacy',
    label: 'Privacy Policy',
    icon: 'faShieldAlt'
  }
};

// Grouped routes for different sections
export const mainNavRoutes = ['dashboard', 'earn', 'videos', 'rewards', 'referrals'];
export const supportRoutes = ['help', 'contact', 'terms', 'privacy'];

export default routes; 