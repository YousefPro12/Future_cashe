import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchOffers = createAsyncThunk(
  'offers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.offers.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch offers' });
    }
  }
);

export const fetchOfferProviders = createAsyncThunk(
  'offers/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.offers.getProviders();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch offer providers' });
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  'offers/fetchById',
  async (offerId, { rejectWithValue }) => {
    try {
      const response = await api.offers.getById(offerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch offer details' });
    }
  }
);

export const trackOfferClick = createAsyncThunk(
  'offers/trackClick',
  async (offerId, { rejectWithValue }) => {
    try {
      const response = await api.offers.trackClick(offerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to track offer click' });
    }
  }
);

export const fetchOfferHistory = createAsyncThunk(
  'offers/fetchHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.offers.getHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch offer history' });
    }
  }
);

// Initial state
const initialState = {
  items: [],
  providers: [],
  currentOffer: null,
  history: [],
  loading: {
    offers: false,
    providers: false,
    currentOffer: false,
    clicking: false,
    history: false,
  },
  error: null,
  trackingUrl: null,
  pagination: {
    history: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10
    }
  }
};

// Slice
const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    clearOffersError: (state) => {
      state.error = null;
    },
    clearCurrentOffer: (state) => {
      state.currentOffer = null;
    },
    clearTrackingUrl: (state) => {
      state.trackingUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Offers
      .addCase(fetchOffers.pending, (state) => {
        state.loading.offers = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading.offers = false;
        state.items = action.payload.offers;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading.offers = false;
        state.error = action.payload?.message || 'Failed to fetch offers';
      })
      
      // Fetch Offer Providers
      .addCase(fetchOfferProviders.pending, (state) => {
        state.loading.providers = true;
        state.error = null;
      })
      .addCase(fetchOfferProviders.fulfilled, (state, action) => {
        state.loading.providers = false;
        state.providers = action.payload.offerWalls;
      })
      .addCase(fetchOfferProviders.rejected, (state, action) => {
        state.loading.providers = false;
        state.error = action.payload?.message || 'Failed to fetch offer providers';
      })
      
      // Fetch Offer by ID
      .addCase(fetchOfferById.pending, (state) => {
        state.loading.currentOffer = true;
        state.error = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.loading.currentOffer = false;
        state.currentOffer = action.payload.offer;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.loading.currentOffer = false;
        state.error = action.payload?.message || 'Failed to fetch offer details';
      })
      
      // Track Offer Click
      .addCase(trackOfferClick.pending, (state) => {
        state.loading.clicking = true;
        state.error = null;
      })
      .addCase(trackOfferClick.fulfilled, (state, action) => {
        state.loading.clicking = false;
        state.trackingUrl = action.payload.trackingUrl;
      })
      .addCase(trackOfferClick.rejected, (state, action) => {
        state.loading.clicking = false;
        state.error = action.payload?.message || 'Failed to track offer click';
      })
      
      // Fetch Offer History
      .addCase(fetchOfferHistory.pending, (state) => {
        state.loading.history = true;
        state.error = null;
      })
      .addCase(fetchOfferHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.history = action.payload.completions;
        state.pagination.history = action.payload.pagination;
      })
      .addCase(fetchOfferHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error = action.payload?.message || 'Failed to fetch offer history';
      });
  },
});

export const { clearOffersError, clearCurrentOffer, clearTrackingUrl } = offersSlice.actions;
export default offersSlice.reducer;