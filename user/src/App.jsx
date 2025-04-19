import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import AppRouter from './Router';
import { setAuthStateFromStorage } from './store/slices/authSlice';

// Logo component
import Logo from './components/Logo';

// App inner component that can use Redux hooks
const AppContent = () => {
  const dispatch = useDispatch();
  
  // Check auth status on app startup
  useEffect(() => {
    dispatch(setAuthStateFromStorage());
  }, [dispatch]);
  
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">
      <Logo size="medium" />
    </div>}>
      <AppRouter />
    </Suspense>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
