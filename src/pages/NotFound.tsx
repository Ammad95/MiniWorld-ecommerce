import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after a brief moment
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-deepPurple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-white">!</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          This page doesn't exist or has been moved. You'll be redirected to our homepage in a moment.
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-gradient-to-r from-deepPurple-500 to-purple-600 h-2 rounded-full animate-pulse w-full"></div>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-deepPurple-600 to-purple-600 text-white font-medium rounded-lg hover:from-deepPurple-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound; 