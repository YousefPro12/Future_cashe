import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReferrals,
  fetchReferralInfo,
  fetchReferralStats,
  validateReferralCode,
  clearReferralsError,
  clearCodeValidation
} from '../store/slices/referralsSlice';

/**
 * Custom hook for referral-related functionality
 * @returns {Object} Referral utilities and state
 */
const useReferrals = () => {
  const dispatch = useDispatch();
  const referrals = useSelector(state => state.referrals);

  /**
   * Load user's referrals with pagination
   * @param {Object} params - Pagination parameters (page, limit)
   */
  const loadReferrals = useCallback((params = {}) => {
    dispatch(fetchReferrals(params));
  }, [dispatch]);

  /**
   * Load referral program information
   */
  const loadReferralInfo = useCallback(() => {
    dispatch(fetchReferralInfo());
  }, [dispatch]);

  /**
   * Load detailed referral statistics
   */
  const loadReferralStats = useCallback(() => {
    dispatch(fetchReferralStats());
  }, [dispatch]);

  /**
   * Validate a referral code
   * @param {string} code - Referral code to validate
   */
  const validateCode = useCallback((code) => {
    dispatch(validateReferralCode(code));
  }, [dispatch]);

  /**
   * Clear referral code validation status
   */
  const clearValidation = useCallback(() => {
    dispatch(clearCodeValidation());
  }, [dispatch]);

  /**
   * Clear any referral-related errors
   */
  const clearErrors = useCallback(() => {
    dispatch(clearReferralsError());
  }, [dispatch]);

  /**
   * Copy referral link to clipboard
   * @returns {boolean} Success status
   */
  const copyReferralLink = useCallback(() => {
    const { referral_link } = referrals.programInfo;
    
    if (!referral_link) return false;
    
    try {
      navigator.clipboard.writeText(referral_link);
      return true;
    } catch (error) {
      console.error('Failed to copy referral link:', error);
      return false;
    }
  }, [referrals.programInfo]);
  
  /**
   * Get referral URL to share
   * @returns {string|null} Referral URL or null if not available
   */
  const getReferralUrl = useCallback(() => {
    return referrals.programInfo.referral_link || null;
  }, [referrals.programInfo]);

  return {
    // State
    referralsList: referrals.referrals,
    stats: referrals.stats,
    pagination: referrals.pagination,
    programInfo: referrals.programInfo,
    detailedStats: referrals.detailedStats,
    codeValidation: referrals.codeValidation,
    loading: referrals.loading,
    error: referrals.error,
    
    // Actions
    loadReferrals,
    loadReferralInfo,
    loadReferralStats,
    validateCode,
    clearValidation,
    clearErrors,
    copyReferralLink,
    getReferralUrl,
  };
};

export default useReferrals; 