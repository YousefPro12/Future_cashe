import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';

// Import UI components
import { Button } from '../UI/button';
import { Input } from '../UI/input';
import { Alert } from '../UI/alert';
import { Checkbox } from '../UI/checkbox';

const SignupForm = () => {
  const { register: registerUser, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit,
    watch,
    control,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      referral_code: '',
      terms: false
    }
  });

  // For password confirmation validation
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setError(null);
      // Remove confirmPassword and terms from data before sending to API
      const { confirmPassword, terms, ...registrationData } = data;
      await registerUser(registrationData);
      // Redirect happens in the useAuth hook
    } catch (err) {
      // Local error handling
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Use the local error state, which won't be cleared by navigation attempts
  const displayError = error || authError;

  return (
    <>
      {displayError && (
        <Alert variant="destructive" className="mb-4">
          {displayError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="fullname" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="fullname"
            type="text"
            autoComplete="name"
            {...register('fullname', {
              required: 'Full name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters'
              }
            })}
            error={errors.fullname}
            disabled={loading}
          />
          {errors.fullname && (
            <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email'
              }
            })}
            error={errors.email}
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must include uppercase, lowercase, number and special character'
                }
              })}
              error={errors.password}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match'
            })}
            error={errors.confirmPassword}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="referral_code" className="text-sm font-medium">
            Referral Code (Optional)
          </label>
          <Input
            id="referral_code"
            type="text"
            {...register('referral_code')}
            disabled={loading}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Controller
            name="terms"
            control={control}
            rules={{ required: 'You must agree to the terms and conditions' }}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={loading}
              />
            )}
          />
          <div className="leading-tight">
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              I agree to the Terms of Service and Privacy Policy
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </>
  );
};

export default SignupForm; 