import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';

// Import UI components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Alert } from '@/components/UI/alert';
import { PasswordInput } from '@/components/UI/password-input';

const LoginForm = ({ onSuccess }) => {
  const { login, loading, error: authError } = useAuth();
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      await login(data);
      // Call the onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
      // Redirect happens in the useAuth hook
    } catch (err) {
      // Handle the error locally instead of relying on the auth state
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
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
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="your.email@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email'
              }
            })}
            error={errors.email}
            disabled={loading}
            className="w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            showStrengthIndicator={false}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button 
            type="button" 
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </>
  );
};

export default LoginForm; 