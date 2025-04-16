import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchVideos = createAsyncThunk(
  'videos/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.videos.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch videos' });
    }
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.videos.getById(videoId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch video details' });
    }
  }
);

export const startWatchingVideo = createAsyncThunk(
  'videos/startWatching',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await api.videos.startWatching(videoId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to start watching video' });
    }
  }
);

export const completeWatchingVideo = createAsyncThunk(
  'videos/completeWatching',
  async ({ videoId, watchTimeSeconds }, { rejectWithValue }) => {
    try {
      const response = await api.videos.completeWatching(videoId, watchTimeSeconds);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to complete watching video' });
    }
  }
);

export const fetchVideoHistory = createAsyncThunk(
  'videos/fetchHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.videos.getHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch video history' });
    }
  }
);

// Initial state
const initialState = {
  items: [],
  currentVideo: null,
  history: [],
  pagination: {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20
  },
  loading: {
    videos: false,
    currentVideo: false,
    history: false,
    starting: false,
    completing: false,
  },
  error: null,
  watchInfo: null,
  watchSuccess: null,
};

// Slice
const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearVideosError: (state) => {
      state.error = null;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    clearWatchInfo: (state) => {
      state.watchInfo = null;
    },
    clearWatchSuccess: (state) => {
      state.watchSuccess = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading.videos = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading.videos = false;
        state.items = action.payload.videos || [];
        state.pagination = action.payload.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 20
        };
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading.videos = false;
        state.error = action.payload?.message || 'Failed to fetch videos';
      })
      
      // Fetch Video by ID
      .addCase(fetchVideoById.pending, (state) => {
        state.loading.currentVideo = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading.currentVideo = false;
        state.currentVideo = action.payload.video;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading.currentVideo = false;
        state.error = action.payload?.message || 'Failed to fetch video details';
      })
      
      // Start Watching Video
      .addCase(startWatchingVideo.pending, (state) => {
        state.loading.starting = true;
        state.error = null;
        state.watchInfo = null;
      })
      .addCase(startWatchingVideo.fulfilled, (state, action) => {
        state.loading.starting = false;
        state.watchInfo = {
          watchTimeRequired: action.payload.watch_time_required,
          points: action.payload.points,
          message: action.payload.message
        };
      })
      .addCase(startWatchingVideo.rejected, (state, action) => {
        state.loading.starting = false;
        if (action.payload?.already_watched) {
          state.watchInfo = {
            alreadyWatched: true,
            message: action.payload.message
          };
        } else {
          state.error = action.payload?.message || 'Failed to start watching video';
        }
      })
      
      // Complete Watching Video
      .addCase(completeWatchingVideo.pending, (state) => {
        state.loading.completing = true;
        state.error = null;
        state.watchSuccess = null;
      })
      .addCase(completeWatchingVideo.fulfilled, (state, action) => {
        state.loading.completing = false;
        state.watchSuccess = {
          pointsEarned: action.payload.points_earned,
          newBalance: action.payload.new_balance,
          message: action.payload.message
        };
        
        // Mark the video as watched in the items list
        const videoIndex = state.items.findIndex(video => video.id === state.currentVideo?.id);
        if (videoIndex !== -1) {
          state.items[videoIndex].watched = true;
        }
        
        // Update current video if loaded
        if (state.currentVideo) {
          state.currentVideo.watched = true;
        }
      })
      .addCase(completeWatchingVideo.rejected, (state, action) => {
        state.loading.completing = false;
        if (action.payload?.already_watched) {
          state.watchSuccess = {
            alreadyWatched: true,
            message: action.payload.message
          };
        } else if (action.payload?.watch_time_required) {
          // Handle insufficient watch time
          state.watchInfo = {
            watchTimeRequired: action.payload.watch_time_required,
            watchTimeProvided: action.payload.watch_time_provided,
            message: action.payload.message,
            insufficient: true
          };
        } else {
          state.error = action.payload?.message || 'Failed to complete watching video';
        }
      })
      
      // Fetch Video History
      .addCase(fetchVideoHistory.pending, (state) => {
        state.loading.history = true;
        state.error = null;
      })
      .addCase(fetchVideoHistory.fulfilled, (state, action) => {
        state.loading.history = false;
        state.history = action.payload.views || [];
        state.pagination = action.payload.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 10
        };
      })
      .addCase(fetchVideoHistory.rejected, (state, action) => {
        state.loading.history = false;
        state.error = action.payload?.message || 'Failed to fetch video history';
      });
  },
});

export const { clearVideosError, clearCurrentVideo, clearWatchInfo, clearWatchSuccess, setCurrentPage } = videosSlice.actions;
export default videosSlice.reducer; 