import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

// Import UI components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Card } from '@/components/UI/card';
import { Alert } from '@/components/UI/alert';
import Logo from '@/components/Logo';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { resetPassword, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email,
      otp: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // For password confirmation validation
  const password = watch('newPassword');

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword from data before sending to API
      const { confirmPassword, ...resetData } = data;
      await resetPassword(resetData);
      // Success handling is done in the useAuth hook
    } catch (err) {
      // Error handling is done in the useAuth hook
      console.error('Reset password error:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" size="large" />
          <h1 className="text-2xl font-bold">Set New Password</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the code sent to your email and create a new password
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              disabled={loading || email}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="otp" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              {...register('otp', {
                required: 'Verification code is required',
                pattern: {
                  value: /^\d+$/,
                  message: 'Please enter a valid code (numbers only)'
                },
                minLength: {
                  value: 6,
                  message: 'Code must be at least 6 digits'
                },
                maxLength: {
                  value: 6,
                  message: 'Code cannot be more than 6 digits'
                }
              })}
              error={errors.otp}
              disabled={loading}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('newPassword', {
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
                error={errors.newPassword}
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
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            <button
              type="button"
              onClick={() => navigate('/login')} 
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Back to Login
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword; 