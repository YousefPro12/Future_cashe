import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';

// Import UI components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Alert } from '@/components/UI/alert';
import { Checkbox } from '@/components/UI/checkbox';
import { PasswordInput } from '@/components/UI/password-input';

const SignupForm = ({ onSuccess }) => {
  const { register: registerUser, loading, error: authError } = useAuth();
  const [error, setError] = useState(null);
  
  const { 
    register, 
    handleSubmit,
    control,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullname: '',
      terms: false
    }
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      // Remove terms from data before sending to API
      const { terms, ...registrationData } = data;
      await registerUser(registrationData);
      
      // Call onSuccess callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
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
            placeholder="John Doe"
            {...register('fullname', {
              required: 'Full name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters'
              }
            })}
            error={errors.fullname}
            disabled={loading}
            className="w-full"
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
            autoComplete="new-password"
            placeholder="••••••••"
            showStrengthIndicator={true}
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
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
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
        
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </>
  );
};

export default SignupForm; 