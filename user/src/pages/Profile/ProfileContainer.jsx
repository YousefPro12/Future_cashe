import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, fetchUserPoints } from '@/store/slices/userSlice';
import { fetchReferralInfo } from '@/store/slices/referralsSlice';
import ProfilePresenter from './ProfilePresenter';

const ProfileContainer = () => {
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const { profile, points, loading: userLoading, error: userError } = useSelector(state => state.user);
  const { programInfo, loading: referralLoading, error: referralError } = useSelector(state => state.referrals);
  
  // Combined loading and error states
  const isLoading = userLoading?.profile || userLoading?.points || referralLoading?.info;
  const error = userError || referralError;
  
  // Fetch user data on component mount
  // Remove console.log statements that might trigger re-renders
  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserPoints());
    dispatch(fetchReferralInfo());
  }, [dispatch]);
  
  // Remove these console logs
  // console.log('Profile data:', profile);
  // console.log('Referral info:', programInfo);
  
  // Extract the user object from the profile response
  const userData = profile?.user || {};
  
  // Make sure we're extracting the referral code correctly
  const userReferralCode = programInfo?.referral_code || 
                          programInfo?.code || 
                          'Not available';
  
  return (
    <ProfilePresenter 
      profile={userData}
      pointsBalance={points?.balance || 0}
      referralCode={userReferralCode}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default ProfileContainer;