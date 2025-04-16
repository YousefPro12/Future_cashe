import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchReferrals = createAsyncThunk(
  'referrals/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.referrals.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch referrals' });
    }
  }
);

export const fetchReferralInfo = createAsyncThunk(
  'referrals/fetchInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.referrals.getInfo();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch referral program info' });
    }
  }
);

export const fetchReferralStats = createAsyncThunk(
  'referrals/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.referrals.getStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch referral statistics' });
    }
  }
);

export const validateReferralCode = createAsyncThunk(
  'referrals/validateCode',
  async (referralCode, { rejectWithValue }) => {
    try {
      const response = await api.referrals.validateCode(referralCode);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to validate referral code' });
    }
  }
);

// Initial state
const initialState = {
  // Referrals list from /referrals endpoint
  referrals: [],
  stats: {
    total_referrals: 0,
    active_referrals: 0,
    total_earnings: 0,
  },
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  },
  
  // Program info from /referrals/info endpoint
  programInfo: {
    referral_code: null,
    referral_link: null,
    program_info: {
      points_per_referral: '100',
      min_activity_required: 'true',
      points_per_offer: '10'
    }
  },
  
  // Detailed stats from /referrals/stats endpoint
  detailedStats: {
    overall: {
      total_referrals: 0,
      total_earnings: 0
    },
    monthly_stats: []
  },
  
  // Code validation from /referrals/validate endpoint
  codeValidation: {
    valid: false,
    message: '',
    referrer_id: null
  },
  
  // UI state
  loading: {
    referrals: false,
    info: false,
    stats: false,
    validation: false
  },
  error: null,
};

// Slice
const referralsSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    clearReferralsError: (state) => {
      state.error = null;
    },
    clearCodeValidation: (state) => {
      state.codeValidation = {
        valid: false,
        message: '',
        referrer_id: null
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Referrals
      .addCase(fetchReferrals.pending, (state) => {
        state.loading.referrals = true;
        state.error = null;
      })
      .addCase(fetchReferrals.fulfilled, (state, action) => {
        state.loading.referrals = false;
        state.referrals = action.payload.referrals || [];
        state.stats = action.payload.stats || {
          total_referrals: 0,
          active_referrals: 0,
          total_earnings: 0
        };
        state.pagination = action.payload.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10
        };
      })
      .addCase(fetchReferrals.rejected, (state, action) => {
        state.loading.referrals = false;
        state.error = action.payload?.message || 'Failed to fetch referrals';
      })
      
      // Fetch Referral Info
      .addCase(fetchReferralInfo.pending, (state) => {
        state.loading.info = true;
        state.error = null;
      })
      .addCase(fetchReferralInfo.fulfilled, (state, action) => {
        state.loading.info = false;
        state.programInfo = {
          referral_code: action.payload.referral_code || null,
          referral_link: action.payload.referral_link || null,
          total_referrals: action.payload.total_referrals || 0,
          total_earnings: action.payload.total_earnings || 0,
          program_info: action.payload.program_info || {
            points_per_referral: '100',
            min_activity_required: 'true',
            points_per_offer: '10'
          }
        };
      })
      .addCase(fetchReferralInfo.rejected, (state, action) => {
        state.loading.info = false;
        state.error = action.payload?.message || 'Failed to fetch referral program info';
      })
      
      // Fetch Referral Stats
      .addCase(fetchReferralStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchReferralStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.detailedStats = {
          overall: action.payload.overall || {
            total_referrals: 0,
            total_earnings: 0
          },
          monthly_stats: action.payload.monthly_stats || []
        };
      })
      .addCase(fetchReferralStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload?.message || 'Failed to fetch referral statistics';
      })
      
      // Validate Referral Code
      .addCase(validateReferralCode.pending, (state) => {
        state.loading.validation = true;
        state.error = null;
      })
      .addCase(validateReferralCode.fulfilled, (state, action) => {
        state.loading.validation = false;
        state.codeValidation = {
          valid: action.payload.valid || false,
          message: action.payload.message || '',
          referrer_id: action.payload.referrer_id || null
        };
      })
      .addCase(validateReferralCode.rejected, (state, action) => {
        state.loading.validation = false;
        state.error = action.payload?.message || 'Failed to validate referral code';
        state.codeValidation = {
          valid: false,
          message: action.payload?.message || 'Failed to validate referral code',
          referrer_id: null
        };
      });
  },
});

export const { clearReferralsError, clearCodeValidation } = referralsSlice.actions;
export default referralsSlice.reducer; 