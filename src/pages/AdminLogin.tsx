import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';

export function AdminLogin() {
  const { user, isAdmin, loading, signInWithGoogle } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-600"></div>
      </div>
    );
  }

  if (user && isAdmin) {
    // Redirect to dashboard if logged in and admin
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <div className="mx-auto h-12 w-12 bg-royal-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-royal-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage the Asantex Decor website
          </p>
        </div>
        
        {user && !isAdmin && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm text-center">
            You do not have administrator privileges to access this dashboard.
          </div>
        )}

        <div>
          <button
            onClick={signInWithGoogle}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-royal-600 hover:bg-royal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 shadow-sm transition-colors"
          >
            Sign in with Google
          </button>
        </div>
        
        <div className="text-center mt-4">
          <a href="/" className="text-sm font-medium text-royal-600 hover:text-royal-500">
            &larr; Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
