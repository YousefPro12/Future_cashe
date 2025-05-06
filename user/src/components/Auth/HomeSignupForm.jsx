import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';

// Import UI components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Alert } from '@/components/UI/alert';
import { Checkbox } from '@/components/UI/checkbox';
import { PasswordInput } from '@/components/UI/password-input';

const HomeSignupForm = ({ onSuccess }) => {
  const { register: registerUser, loading, error: authError } = useAuth();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // Watch the fullname and email fields
  const { 
    register, 
    handleSubmit,
    control,
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullname: '',
      terms: false
    }
  });

  const fullname = watch('fullname');
  const email = watch('email');

  // Check if we should proceed to password step with animation
  const handleContinue = () => {
    if (fullname && fullname.length >= 3 && email && /\S+@\S+\.\S+/.test(email)) {
      setAnimating(true);
      setTimeout(() => {
        setShowPassword(true);
      }, 300); // Slight delay before showing password fields
    }
  };

  // Handle key press in email field
  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleContinue();
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex justify-center">
          <div className="w-11/12">
            <Input
              id="home-fullname"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              {...register('fullname', {
                required: 'Full name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
              error={errors.fullname}
              disabled={loading}
              className="w-full dark:bg-background dark:text-foreground dark:focus:bg-background dark:autofill:bg-background dark:autofill:text-foreground"
              onBlur={handleContinue}
            />
            {errors.fullname && (
              <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-11/12">
            <Input
              id="home-email"
              type="email"
              autoComplete="email"
              placeholder="Email Address"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Please enter a valid email'
                }
              })}
              error={errors.email}
              disabled={loading}
              className="w-full dark:bg-background dark:text-foreground dark:focus:bg-background dark:autofill:bg-background dark:autofill:text-foreground"
              onBlur={handleContinue}
              onKeyPress={handleEmailKeyPress}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${animating ? 'opacity-0 scale-95' : 'opacity-100'} ${showPassword ? 'hidden' : 'block'} flex justify-center`}>
          <Button 
            type="button" 
            className="w-11/12" 
            onClick={handleContinue}
            disabled={!fullname || fullname.length < 3 || !email || !/\S+@\S+\.\S+/.test(email)}
          >
            Continue
          </Button>
        </div>

        {showPassword && (
          <div className="animate-fadeIn space-y-3">
            <div className="flex justify-center">
              <div className="w-11/12">
                <PasswordInput
                  id="home-password"
                  autoComplete="new-password"
                  placeholder="Create Password"
                  showStrengthIndicator={true}
                  className="dark:bg-background dark:text-foreground dark:focus:bg-background dark:autofill:bg-background dark:autofill:text-foreground"
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
            </div>

            <div className="flex justify-center">
              <div className="w-11/12 flex items-start space-x-2">
                <Controller
                  name="terms"
                  control={control}
                  rules={{ required: 'You must agree to the terms and conditions' }}
                  render={({ field }) => (
                    <Checkbox
                      id="home-terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  )}
                />
                <div className="leading-tight">
                  <label htmlFor="home-terms" className="text-sm cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                  {errors.terms && (
                    <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="w-11/12" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Get Started'}
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Replace the style jsx tag with a regular style tag or CSS-in-JS solution */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default HomeSignupForm;