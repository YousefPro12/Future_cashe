import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch profile' });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.user.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update profile' });
    }
  }
);

export const fetchUserActivity = createAsyncThunk(
  'user/fetchActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.getActivity();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch activity' });
    }
  }
);

export const fetchUserPoints = createAsyncThunk(
  'user/fetchPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.user.getPoints();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch points' });
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  points: {
    balance: 0,
    history: [],
  },
  activity: [],
  loading: {
    profile: false,
    points: false,
    activity: false,
  },
  error: null,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    updatePointsBalance: (state, action) => {
      if (state.points) {
        state.points.balance = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload?.message || 'Failed to fetch profile';
      })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.profile = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload?.message || 'Failed to update profile';
      })
      
      // Fetch Activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading.activity = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading.activity = false;
        state.activity = action.payload;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading.activity = false;
        state.error = action.payload?.message || 'Failed to fetch activity';
      })
      
      // Fetch Points
      .addCase(fetchUserPoints.pending, (state) => {
        state.loading.points = true;
        state.error = null;
      })
      .addCase(fetchUserPoints.fulfilled, (state, action) => {
        state.loading.points = false;
        state.points = action.payload;
      })
      .addCase(fetchUserPoints.rejected, (state, action) => {
        state.loading.points = false;
        state.error = action.payload?.message || 'Failed to fetch points';
      });
  },
});

export const { clearUserError, updatePointsBalance } = userSlice.actions;
export default userSlice.reducer; 