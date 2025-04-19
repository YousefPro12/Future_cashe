import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/Auth';
import { Card } from '@/components/UI/card';
import Logo from '@/components/Logo';

const Login = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" size="large" />
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Create one now
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button 
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Forgot password?
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login; 