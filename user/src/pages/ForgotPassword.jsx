import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

// Import UI components
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Card } from '@/components/UI/card';
import { Alert } from '@/components/UI/alert';
import Logo from '@/components/Logo';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, error, resetEmailSent } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      await forgotPassword(data.email);
      // Success handling is done in the useAuth hook
    } catch (err) {
      // Error handling is done in the useAuth hook
      console.error('Forgot password error:', err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" size="large" />
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you a code to reset your password
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        
        {resetEmailSent ? (
          <Alert variant="success" className="mb-4">
            Password reset instructions have been sent to your email. Please check your inbox.
          </Alert>
        ) : (
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
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          <p>
            Remember your password?{' '}
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

export default ForgotPassword; 