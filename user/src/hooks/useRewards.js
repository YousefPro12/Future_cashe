import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRewards,
  fetchRewardCategories,
  fetchRewardById,
  redeemReward,
  fetchRedemptionHistory,
  checkRedemptionStatus,
  clearRewardsError,
  clearCurrentReward,
  clearRedemptionSuccess
} from '../store/slices/rewardsSlice';

/**
 * Custom hook for reward-related functionality
 * @returns {Object} Reward utilities and state
 */
const useRewards = () => {
  const dispatch = useDispatch();
  const rewards = useSelector(state => state.rewards);

  /**
   * Load available rewards with optional filtering
   * @param {Object} filters - Optional filter parameters (category, minPoints, maxPoints, search, page, limit)
   */
  const loadRewards = useCallback((filters = {}) => {
    dispatch(fetchRewards(filters));
  }, [dispatch]);

  /**
   * Load reward categories
   */
  const loadCategories = useCallback(() => {
    dispatch(fetchRewardCategories());
  }, [dispatch]);

  /**
   * Load a specific reward by ID
   * @param {number|string} rewardId - ID of the reward to fetch
   */
  const loadRewardById = useCallback((rewardId) => {
    dispatch(fetchRewardById(rewardId));
  }, [dispatch]);

  /**
   * Redeem a reward
   * @param {number|string} rewardId - ID of the reward to redeem
   * @param {Object} paymentDetails - Payment/delivery details required for redemption
   * @returns {Promise} Promise that resolves with the redemption result
   */
  const handleRedeemReward = useCallback(async (rewardId, paymentDetails) => {
    try {
      const resultAction = await dispatch(redeemReward({ rewardId, paymentDetails }));
      if (redeemReward.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload?.message || 'Failed to redeem reward');
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * Load redemption history with optional pagination
   * @param {Object} params - Optional pagination parameters (page, limit, status)
   */
  const loadRedemptionHistory = useCallback((params = {}) => {
    dispatch(fetchRedemptionHistory(params));
  }, [dispatch]);

  /**
   * Check status of a specific redemption
   * @param {number|string} redemptionId - ID of the redemption to check
   */
  const checkRedemption = useCallback((redemptionId) => {
    dispatch(checkRedemptionStatus(redemptionId));
  }, [dispatch]);

  /**
   * Clear current reward details
   */
  const clearReward = useCallback(() => {
    dispatch(clearCurrentReward());
  }, [dispatch]);

  /**
   * Clear redemption success message
   */
  const clearSuccess = useCallback(() => {
    dispatch(clearRedemptionSuccess());
  }, [dispatch]);

  /**
   * Clear any reward-related errors
   */
  const clearErrors = useCallback(() => {
    dispatch(clearRewardsError());
  }, [dispatch]);

  /**
   * Check if user can afford a particular reward
   * @param {number|string} rewardId - ID of the reward to check
   * @returns {boolean} True if user can afford the reward
   */
  const canAffordReward = useCallback((rewardId) => {
    const reward = rewards.items.find(r => r.id === rewardId);
    if (!reward) return false;
    return reward.can_afford || false;
  }, [rewards.items]);

  return {
    // State
    rewards: rewards.items,
    categories: rewards.categories,
    currentReward: rewards.currentReward,
    redemptions: rewards.redemptions,
    currentRedemption: rewards.currentRedemption,
    userPoints: rewards.userPoints,
    pagination: rewards.pagination,
    loading: rewards.loading,
    error: rewards.error,
    redemptionSuccess: rewards.redemptionSuccess,
    
    // Actions
    loadRewards,
    loadCategories,
    loadRewardById,
    redeemReward: handleRedeemReward,
    loadRedemptionHistory,
    checkRedemption,
    clearReward,
    clearSuccess,
    clearErrors,
    canAffordReward,
  };
};

export default useRewards; 