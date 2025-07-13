import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiAlertCircle } from 'react-icons/fi';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';

interface CreateSubAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateSubAdminModal: React.FC<CreateSubAdminModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { createSubAdmin } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // setSuccess(''); // Removed as per new_code

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await createSubAdmin(formData);
      
      if (result.success) {
        // setSuccess(result.message); // Removed as per new_code
        setFormData({ name: '', email: '', mobile: '' });
        
        // Auto close after success
        setTimeout(() => {
          onClose();
          // setSuccess(''); // Removed as per new_code
          onSuccess(); // Call onSuccess prop
        }, 5000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
    // setSuccess(''); // Removed as per new_code
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: '', email: '', mobile: '' });
      setError('');
      // setSuccess(''); // Removed as per new_code
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md modern-card p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create Sub-Admin</h2>
              <motion.button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2"
                >
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Removed success message div as per new_code */}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input pl-12"
                    placeholder="Enter full name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-12"
                    placeholder="Enter email address"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="form-input pl-12"
                    placeholder="Enter mobile number"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="btn-secondary flex-1"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  className="btn-primary flex-1"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Sub-Admin'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> A temporary password will be generated and sent to the user's email. 
                They will be required to change it on first login.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateSubAdminModal; 