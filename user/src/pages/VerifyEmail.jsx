import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

// Import UI components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Card } from '@/components/UI/card';
import { Alert } from '@/components/UI/alert';
import Logo from '@/components/Logo';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { verifyEmail, loading, error, userEmail } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: userEmail || '',
      otp: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await verifyEmail(data);
      // Success handling is done in the useAuth hook
    } catch (err) {
      // Error handling is done in the useAuth hook
      console.error('Email verification error:', err);
    }
  };

  const handleResendCode = () => {
    // Implement resend code functionality here
    console.log('Resend code');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" size="large" />
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter the verification code sent to your email address
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
              disabled={loading || userEmail}
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

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p>
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Resend Code
            </button>
          </p>
          <p className="mt-2">
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

export default VerifyEmail; 