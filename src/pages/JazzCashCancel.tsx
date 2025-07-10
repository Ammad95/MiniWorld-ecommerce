import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX, FiHome, FiRefreshCw } from 'react-icons/fi';

const JazzCashCancel: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Auto-redirect after 15 seconds
    const timer = setTimeout(() => {
      navigate('/checkout');
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const transactionId = searchParams.get('pp_TxnRefNo') || '';
  const orderNumber = searchParams.get('pp_BillReference') || '';

  return (
    <div className="min-h-screen bg-navy-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-soft p-8 text-center"
          >
            {/* Cancel Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiX className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-navy-900 mb-4">
              Payment Cancelled
            </h1>

            {/* Description */}
            <p className="text-navy-600 mb-8">
              Your JazzCash payment was cancelled. Don't worry, no amount has been deducted from your account.
            </p>

            {/* Transaction Details */}
            {(transactionId || orderNumber) && (
              <div className="bg-navy-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-navy-900 mb-4">Transaction Details</h3>
                <div className="space-y-3 text-left">
                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-navy-600">Transaction ID:</span>
                      <span className="font-mono text-navy-900">{transactionId}</span>
                    </div>
                  )}
                  {orderNumber && (
                    <div className="flex justify-between">
                      <span className="text-navy-600">Order Number:</span>
                      <span className="font-mono text-navy-900">{orderNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-navy-600">Status:</span>
                    <span className="text-red-600 font-semibold">Cancelled</span>
                  </div>
                </div>
              </div>
            )}

            {/* JazzCash Branding */}
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-white">
                <span className="text-2xl">📱</span>
                <span className="font-bold text-lg">JazzCash</span>
                <span className="text-sm opacity-90">Payment Cancelled</span>
              </div>
              <p className="text-white text-sm mt-2 opacity-90">
                Transaction was not completed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-navy-300 text-navy-600 rounded-lg hover:bg-navy-50 transition-colors flex items-center justify-center space-x-2"
              >
                <FiHome className="w-5 h-5" />
                <span>Continue Shopping</span>
              </button>
            </div>

            {/* Auto-redirect Notice */}
            <div className="mt-8 text-sm text-navy-500">
              <p>You will be automatically redirected to checkout in 15 seconds.</p>
            </div>
          </motion.div>

          {/* Troubleshooting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-lg shadow-soft p-6"
          >
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Why was my payment cancelled?</h3>
            <div className="space-y-3 text-sm text-navy-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">1</div>
                <div>
                  <p className="font-medium text-navy-900">User Cancelled</p>
                  <p>You may have clicked the cancel button or closed the payment window.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">2</div>
                <div>
                  <p className="font-medium text-navy-900">Session Timeout</p>
                  <p>The payment session may have expired. Please try again.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">3</div>
                <div>
                  <p className="font-medium text-navy-900">Technical Issue</p>
                  <p>There might be a temporary technical issue with the payment gateway.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Successful Payment</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure you have sufficient balance in your JazzCash wallet</li>
                <li>• Keep your JazzCash app updated to the latest version</li>
                <li>• Use a stable internet connection during payment</li>
                <li>• Complete the payment within the time limit</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JazzCashCancel; 