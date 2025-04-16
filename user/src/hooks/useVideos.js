import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVideos,
  fetchVideoById,
  startWatchingVideo,
  completeWatchingVideo,
  fetchVideoHistory,
  clearVideosError,
  clearCurrentVideo,
  clearWatchInfo,
  clearWatchSuccess,
  setCurrentPage
} from '../store/slices/videosSlice';

/**
 * Custom hook for video-related functionality
 * @returns {Object} Video utilities and state
 */
const useVideos = () => {
  const dispatch = useDispatch();
  const videos = useSelector(state => state.videos);

  /**
   * Load available videos with optional pagination and filters
   * @param {Object} params - Optional parameters (page, limit, country, etc.)
   */
  const loadVideos = useCallback((params = {}) => {
    dispatch(fetchVideos(params));
  }, [dispatch]);

  /**
   * Load a specific video by ID
   * @param {number|string} videoId - ID of the video to fetch
   */
  const loadVideoById = useCallback((videoId) => {
    dispatch(fetchVideoById(videoId));
  }, [dispatch]);

  /**
   * Start watching a video
   * @param {number|string} videoId - ID of the video to watch
   * @returns {Promise} Promise that resolves with the watch info
   */
  const startVideo = useCallback(async (videoId) => {
    try {
      const resultAction = await dispatch(startWatchingVideo(videoId));
      if (startWatchingVideo.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.payload?.message || 'Failed to start watching video');
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  /**
   * Complete watching a video
   * @param {number|string} videoId - ID of the video that was watched
   * @param {number} watchTimeSeconds - Time spent watching the video in seconds
   * @returns {Promise} Promise that resolves with the completion result
   */
  const completeVideo = useCallback(async (videoId, watchTimeSeconds) => {
    try {
      const resultAction = await dispatch(completeWatchingVideo({ videoId, watchTimeSeconds }));
      if (completeWatchingVideo.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      throw new Error(resultAction.payload?.message || 'Failed to complete watching video');
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  /**
   * Load video viewing history with optional pagination
   * @param {Object} params - Optional pagination parameters (page, limit, status)
   */
  const loadVideoHistory = useCallback((params = {}) => {
    dispatch(fetchVideoHistory(params));
  }, [dispatch]);

  /**
   * Set current page for pagination
   * @param {number} page - Page number
   */
  const handlePageChange = useCallback((page) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  /**
   * Clear current video details
   */
  const clearVideo = useCallback(() => {
    dispatch(clearCurrentVideo());
  }, [dispatch]);

  /**
   * Clear watch info state (used after starting a video)
   */
  const clearWatch = useCallback(() => {
    dispatch(clearWatchInfo());
  }, [dispatch]);

  /**
   * Clear watch success state (used after completing a video)
   */
  const clearSuccess = useCallback(() => {
    dispatch(clearWatchSuccess());
  }, [dispatch]);

  /**
   * Clear any video-related errors
   */
  const clearErrors = useCallback(() => {
    dispatch(clearVideosError());
  }, [dispatch]);

  /**
   * Check if video is watched
   * @param {number|string} videoId - ID of the video to check
   * @returns {boolean} True if the video has been watched
   */
  const isVideoWatched = useCallback((videoId) => {
    const video = videos.items.find(v => v.id === videoId);
    return video ? video.watched : false;
  }, [videos.items]);

  return {
    // State
    videosList: videos.items,
    currentVideo: videos.currentVideo,
    history: videos.history,
    pagination: videos.pagination,
    loading: videos.loading,
    error: videos.error,
    watchInfo: videos.watchInfo,
    watchSuccess: videos.watchSuccess,
    
    // Actions
    loadVideos,
    loadVideoById,
    startVideo,
    completeVideo,
    loadVideoHistory,
    handlePageChange,
    clearVideo,
    clearWatch,
    clearSuccess,
    clearErrors,
    isVideoWatched,
  };
};

export default useVideos; 