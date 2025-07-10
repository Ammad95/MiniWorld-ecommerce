import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiKey, FiCheck } from 'react-icons/fi';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { state, forgotPassword, clearError } = useCustomerAuth();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await forgotPassword(email);
    if (success) {
      setIsEmailSent(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (state.error) clearError();
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-deepPurple-900 via-violet-800 to-indigo-900 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center"
        >
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-deepPurple-900 mb-4">Check Your Email</h1>
          <p className="text-deepPurple-600 mb-6">
            We've sent a password reset code to <strong>{email}</strong>. 
            Please check your email and follow the instructions to reset your password.
          </p>
          
          <div className="space-y-4">
            <motion.button
              onClick={() => navigate('/customer/reset-password', { state: { email } })}
              className="w-full btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Reset Code
            </motion.button>
            
            <button
              onClick={() => setIsEmailSent(false)}
              className="w-full text-deepPurple-600 hover:text-deepPurple-800 transition-colors"
            >
              Use different email
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-deepPurple-600">
              Remember your password?{' '}
              <Link to="/customer/login" className="text-deepPurple-600 hover:text-deepPurple-500 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple-900 via-violet-800 to-indigo-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/customer/login" className="inline-flex items-center space-x-2 text-deepPurple-600 hover:text-deepPurple-800 transition-colors mb-4">
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
          <div className="bg-gradient-to-r from-deepPurple-600 to-violet-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiKey className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-deepPurple-900 mb-2">Forgot Password?</h1>
          <p className="text-deepPurple-600">
            No worries! Enter your email address and we'll send you a reset code.
          </p>
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

        {/* Forgot Password Form */}
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
                value={email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                placeholder="Enter your email address"
                required
              />
            </div>
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
                <span>Sending reset code...</span>
              </div>
            ) : (
              'Send Reset Code'
            )}
          </motion.button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Demo Account</h4>
          <p className="text-sm text-blue-700 mb-2">Try with:</p>
          <div className="text-xs text-blue-600">
            <div>Email: john.doe@example.com</div>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-deepPurple-600">
            Remember your password?{' '}
            <Link to="/customer/login" className="text-deepPurple-600 hover:text-deepPurple-500 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 