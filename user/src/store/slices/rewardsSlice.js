import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchRewards = createAsyncThunk(
  'rewards/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.rewards.getAll(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch rewards' });
    }
  }
);

export const fetchRewardCategories = createAsyncThunk(
  'rewards/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.rewards.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch reward categories' });
    }
  }
);

export const fetchRewardById = createAsyncThunk(
  'rewards/fetchById',
  async (rewardId, { rejectWithValue }) => {
    try {
      const response = await api.rewards.getById(rewardId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch reward details' });
    }
  }
);

export const redeemReward = createAsyncThunk(
  'rewards/redeem',
  async ({ rewardId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await api.rewards.redeem(rewardId, paymentDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to redeem reward' });
    }
  }
);

export const fetchRedemptionHistory = createAsyncThunk(
  'rewards/fetchHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.rewards.getHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch redemption history' });
    }
  }
);

export const checkRedemptionStatus = createAsyncThunk(
  'rewards/checkRedemptionStatus',
  async (redemptionId, { rejectWithValue }) => {
    try {
      const response = await api.rewards.getRedemptionStatus(redemptionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to check redemption status' });
    }
  }
);

// Initial state
const initialState = {
  // Rewards list from /rewards endpoint
  items: [],
  categories: [],
  currentReward: null,
  redemptions: [],
  currentRedemption: null,
  userPoints: 0,
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20
  },
  loading: {
    rewards: false,
    categories: false,
    currentReward: false,
    redemptions: false,
    redemptionStatus: false,
    redeeming: false,
  },
  error: null,
  redemptionSuccess: null,
};

// Slice
const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    clearRewardsError: (state) => {
      state.error = null;
    },
    clearCurrentReward: (state) => {
      state.currentReward = null;
    },
    clearRedemptionSuccess: (state) => {
      state.redemptionSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Rewards
      .addCase(fetchRewards.pending, (state) => {
        state.loading.rewards = true;
        state.error = null;
      })
      .addCase(fetchRewards.fulfilled, (state, action) => {
        state.loading.rewards = false;
        state.items = action.payload.rewards || [];
        state.userPoints = action.payload.user_points || 0;
        state.pagination = action.payload.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 20
        };
      })
      .addCase(fetchRewards.rejected, (state, action) => {
        state.loading.rewards = false;
        state.error = action.payload?.message || 'Failed to fetch rewards';
      })
      
      // Fetch Reward Categories
      .addCase(fetchRewardCategories.pending, (state) => {
        state.loading.categories = true;
        state.error = null;
      })
      .addCase(fetchRewardCategories.fulfilled, (state, action) => {
        state.loading.categories = false;
        state.categories = action.payload.categories || [];
      })
      .addCase(fetchRewardCategories.rejected, (state, action) => {
        state.loading.categories = false;
        state.error = action.payload?.message || 'Failed to fetch reward categories';
      })
      
      // Fetch Reward by ID
      .addCase(fetchRewardById.pending, (state) => {
        state.loading.currentReward = true;
        state.error = null;
      })
      .addCase(fetchRewardById.fulfilled, (state, action) => {
        state.loading.currentReward = false;
        state.currentReward = action.payload.reward;
      })
      .addCase(fetchRewardById.rejected, (state, action) => {
        state.loading.currentReward = false;
        state.error = action.payload?.message || 'Failed to fetch reward details';
      })
      
      // Redeem Reward
      .addCase(redeemReward.pending, (state) => {
        state.loading.redeeming = true;
        state.error = null;
        state.redemptionSuccess = null;
      })
      .addCase(redeemReward.fulfilled, (state, action) => {
        state.loading.redeeming = false;
        state.redemptionSuccess = {
          message: action.payload.message,
          redemption: action.payload.redemption,
          newBalance: action.payload.new_balance
        };
        // Update user points balance
        state.userPoints = action.payload.new_balance;
      })
      .addCase(redeemReward.rejected, (state, action) => {
        state.loading.redeeming = false;
        state.error = action.payload?.message || 'Failed to redeem reward';
      })
      
      // Fetch Redemption History
      .addCase(fetchRedemptionHistory.pending, (state) => {
        state.loading.redemptions = true;
        state.error = null;
      })
      .addCase(fetchRedemptionHistory.fulfilled, (state, action) => {
        state.loading.redemptions = false;
        state.redemptions = action.payload.redemptions || [];
        state.pagination = action.payload.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10
        };
      })
      .addCase(fetchRedemptionHistory.rejected, (state, action) => {
        state.loading.redemptions = false;
        state.error = action.payload?.message || 'Failed to fetch redemption history';
      })
      
      // Check Redemption Status
      .addCase(checkRedemptionStatus.pending, (state) => {
        state.loading.redemptionStatus = true;
        state.error = null;
      })
      .addCase(checkRedemptionStatus.fulfilled, (state, action) => {
        state.loading.redemptionStatus = false;
        state.currentRedemption = action.payload.redemption;
      })
      .addCase(checkRedemptionStatus.rejected, (state, action) => {
        state.loading.redemptionStatus = false;
        state.error = action.payload?.message || 'Failed to check redemption status';
      });
  },
});

export const { clearRewardsError, clearCurrentReward, clearRedemptionSuccess } = rewardsSlice.actions;
export default rewardsSlice.reducer; 