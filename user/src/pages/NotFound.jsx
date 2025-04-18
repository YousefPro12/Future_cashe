import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

/**
 * NotFound page component - displayed for 404 errors
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 text-center">
      <Logo className="mb-6" size="large" />
      
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
        Oops! The page you're looking for doesn't exist.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
      >
        Go back home
      </button>
    </div>
  );
};

export default NotFound; 