import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import offersReducer from './slices/offersSlice';
import videosReducer from './slices/videosSlice';
import rewardsReducer from './slices/rewardsSlice';
import chatReducer from './slices/chatSlice';
import referralsReducer from './slices/referralsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    offers: offersReducer,
    videos: videosReducer,
    rewards: rewardsReducer,
    chat: chatReducer,
    referrals: referralsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 