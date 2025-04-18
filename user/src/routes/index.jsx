import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Earn, Home, Dashboard, Login, Register, VerifyEmail, NotFound } from '@/pages';

/**
 * Router configuration with layout structure
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'earn',
        element: <Earn />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
      {
        path: '*',
        element: <NotFound />,
      }
    ],
  },
]);

export default router; 