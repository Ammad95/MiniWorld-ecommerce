import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowLeft } from 'react-icons/fi';
import { useOrder } from '../context/OrderContext';

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrder();
  
  if (!orderId) {
    return <Navigate to="/orders" replace />;
  }
  
  const order = getOrder(orderId);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-navy-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FiPackage className="w-24 h-24 text-navy-400 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Order Not Found</h1>
            <p className="text-navy-600 text-lg mb-8">
              The order you're looking for doesn't exist.
            </p>
            <Link to="/orders">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Orders
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/orders" 
            className="inline-flex items-center space-x-2 text-navy-600 hover:text-navy-800 transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>
          <h1 className="text-4xl font-bold text-navy-900 mb-2">
            Order #{order.orderNumber}
          </h1>
          <p className="text-navy-600">
            Placed on {order.createdAt.toLocaleDateString()}
          </p>
        </motion.div>

        <div className="bg-white rounded-lg shadow-soft p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize font-medium text-orange-600">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold">${order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Items:</span>
              <span>{order.items.length} items</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping to:</span>
              <span>{order.shippingAddress.fullName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage; 