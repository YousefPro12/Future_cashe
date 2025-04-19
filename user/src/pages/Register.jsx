import { useNavigate } from 'react-router-dom';
import { SignupForm } from '@/components/Auth';
import { Card } from '@/components/UI/card';
import Logo from '@/components/Logo';

const Register = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" size="large" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Join us and start earning rewards</p>
        </div>

        <SignupForm />

        <div className="mt-6 text-center text-sm">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register; 