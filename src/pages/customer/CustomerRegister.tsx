import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const CustomerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { state, register, clearError } = useCustomerAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/customer/dashboard');
    }
  }, [state.isAuthenticated, navigate]);

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setValidationError('First name and last name are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    // Confirm passwords match
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const success = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.trim() || undefined,
      password: formData.password
    });

    if (success) {
      navigate('/customer/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (state.error) clearError();
    if (validationError) setValidationError('');
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
          <div className="bg-gradient-to-r from-deepPurple-600 to-violet-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-deepPurple-900 mb-2">Create Account</h1>
          <p className="text-deepPurple-600">Join MiniHub for the best baby products</p>
        </div>

        {/* Error Messages */}
        {(state.error || validationError) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {state.error || validationError}
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-deepPurple-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                  placeholder="First name"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-deepPurple-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
          </div>

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
            <label htmlFor="phone" className="block text-sm font-medium text-deepPurple-700 mb-2">
              Phone Number <span className="text-gray-400">(optional)</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                placeholder="Your phone number"
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
                placeholder="Create a password"
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
            <p className="text-xs text-deepPurple-500 mt-1">At least 8 characters with uppercase, lowercase, and number</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-deepPurple-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-deepPurple-200 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-deepPurple-500 transition-colors"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 hover:text-deepPurple-600 transition-colors"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
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
                <span>Creating account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>



        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-deepPurple-600">
            Already have an account?{' '}
            <Link to="/customer/login" className="text-deepPurple-600 hover:text-deepPurple-500 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerRegister; 
