import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchOffers, 
  fetchOfferProviders, 
  fetchOfferById, 
  trackOfferClick,
  clearTrackingUrl,
  clearOffersError
} from '../store/slices/offersSlice';

/**
 * Custom hook for offer-related functionality
 * @returns {Object} Offer utilities and state
 */
const useOffers = () => {
  const dispatch = useDispatch();
  const offers = useSelector(state => state.offers);

  /**
   * Load all available offers
   * @param {Object} params - Optional query parameters (page, limit, filters)
   */
  const loadOffers = useCallback((params = {}) => {
    dispatch(fetchOffers(params));
  }, [dispatch]);

  /**
   * Load all offer providers (offer walls)
   */
  const loadProviders = useCallback(() => {
    dispatch(fetchOfferProviders());
  }, [dispatch]);

  /**
   * Load a specific offer by ID
   * @param {number|string} offerId - ID of the offer to fetch
   */
  const loadOfferById = useCallback((offerId) => {
    dispatch(fetchOfferById(offerId));
  }, [dispatch]);

  /**
   * Track an offer click and prepare for redirect
   * @param {number|string} offerId - ID of the offer being clicked
   * @returns {Promise<string>} Promise resolving to tracking URL
   */
  const handleOfferClick = useCallback(async (offerId) => {
    try {
      const resultAction = await dispatch(trackOfferClick(offerId));
      if (trackOfferClick.fulfilled.match(resultAction)) {
        return resultAction.payload.trackingUrl;
      }
    } catch (error) {
      console.error('Failed to track offer click:', error);
      return null;
    }
  }, [dispatch]);
  
  /**
   * Redirect user to the offer URL after tracking click
   * @param {number|string} offerId - ID of the offer being clicked
   */
  const clickOffer = useCallback(async (offerId) => {
    const trackingUrl = await handleOfferClick(offerId);
    if (trackingUrl) {
      // Open tracking URL in new window/tab
      window.open(trackingUrl, '_blank', 'noopener,noreferrer');
      // Clear tracking URL from state
      dispatch(clearTrackingUrl());
    }
  }, [dispatch, handleOfferClick]);

  /**
   * Clear any offer-related errors
   */
  const clearErrors = useCallback(() => {
    dispatch(clearOffersError());
  }, [dispatch]);

  return {
    // State
    items: offers.items,
    providers: offers.providers,
    currentOffer: offers.currentOffer,
    loading: offers.loading,
    error: offers.error,
    trackingUrl: offers.trackingUrl,
    
    // Actions
    loadOffers,
    loadProviders,
    loadOfferById,
    clickOffer,
    clearErrors,
  };
};

export default useOffers; 