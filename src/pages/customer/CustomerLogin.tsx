import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { state, login, clearError } = useCustomerAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (state.error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple-900 via-violet-800 to-indigo-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-deepPurple-600 hover:text-deepPurple-800 transition-colors mb-4">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          <div className="bg-gradient-to-r from-deepPurple-600 to-violet-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-deepPurple-900 mb-2">Welcome Back</h1>
          <p className="text-deepPurple-600">Sign in to your MiniWorld account</p>
        </div>

        {/* Error Message */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {state.error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-deepPurple-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-deepPurple-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 hover:text-deepPurple-600 transition-colors"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-deepPurple-600 focus:ring-deepPurple-500 border-deepPurple-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-deepPurple-700">
                Remember me
              </label>
            </div>
            <Link
              to="/customer/forgot-password"
              className="text-sm text-deepPurple-600 hover:text-deepPurple-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={state.isLoading}
            className="w-full btn-primary flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {state.isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Demo Account Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Demo Account</h4>
          <p className="text-sm text-blue-700 mb-2">Use these credentials to test:</p>
          <div className="text-xs text-blue-600 space-y-1">
            <div>Email: john.doe@example.com</div>
            <div>Password: password123</div>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-deepPurple-600">
            Don't have an account?{' '}
            <Link to="/customer/register" className="text-deepPurple-600 hover:text-deepPurple-500 font-medium transition-colors">
              Create one here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerLogin; 