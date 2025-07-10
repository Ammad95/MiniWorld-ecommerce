import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiHome, FiPackage } from 'react-icons/fi';

const JazzCashSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<{
    transactionId: string;
    amount: string;
    status: string;
    orderNumber: string;
  } | null>(null);

  useEffect(() => {
    // Extract payment details from URL parameters
    const transactionId = searchParams.get('pp_TxnRefNo') || '';
    const amount = searchParams.get('pp_Amount') || '';
    const status = searchParams.get('pp_ResponseCode') || '';
    const orderNumber = searchParams.get('pp_BillReference') || '';

    if (transactionId) {
      setPaymentDetails({
        transactionId,
        amount: (parseInt(amount) / 100).toString(), // Convert from paisa to rupees
        status,
        orderNumber,
      });
    }

    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 10000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  const isSuccessful = paymentDetails?.status === '000';

  return (
    <div className="min-h-screen bg-navy-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-soft p-8 text-center"
          >
            {/* Success Icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isSuccessful ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {isSuccessful ? (
                <FiCheck className="w-10 h-10 text-green-600" />
              ) : (
                <FiPackage className="w-10 h-10 text-orange-600" />
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-navy-900 mb-4">
              {isSuccessful ? 'Payment Successful!' : 'Payment Received'}
            </h1>

            {/* Description */}
            <p className="text-navy-600 mb-8">
              {isSuccessful 
                ? 'Your JazzCash payment has been processed successfully.' 
                : 'Your payment is being processed. You will receive a confirmation shortly.'}
            </p>

            {/* JazzCash Branding */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-white">
                <span className="text-2xl">📱</span>
                <span className="font-bold text-lg">JazzCash</span>
                <span className="text-sm opacity-90">Mobile Wallet</span>
              </div>
              <p className="text-white text-sm mt-2 opacity-90">
                Secure, Fast, and Convenient
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <FiPackage className="w-5 h-5" />
                <span>View Orders</span>
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
              <p>You will be automatically redirected to your orders in 10 seconds.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JazzCashSuccess; 