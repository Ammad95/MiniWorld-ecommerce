import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiTruck, 
  FiCheck, 
  FiClock, 
  FiX, 
  FiEye,
  FiMapPin,
  FiCalendar
} from 'react-icons/fi';
import { useOrder } from '../context/OrderContext';
import { OrderStatus } from '../types';

const OrderHistoryPage: React.FC = () => {
  const { getUserOrders, cancelOrder } = useOrder();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  const orders = getUserOrders();
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return FiClock;
      case 'confirmed': return FiCheck;
      case 'processing': return FiPackage;
      case 'shipped': return FiTruck;
      case 'delivered': return FiCheck;
      case 'cancelled': return FiX;
      default: return FiClock;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash_on_delivery': return 'Cash on Delivery';
      default: return method;
    }
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-navy-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FiPackage className="w-24 h-24 text-navy-400 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-navy-900 mb-4">No Orders Yet</h1>
            <p className="text-navy-600 text-lg mb-8">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link to="/">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Shopping
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-navy-900 mb-4">Order History</h1>
          <p className="text-navy-600">Track and manage your orders</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-soft p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Filter by Status</h3>
          <div className="flex flex-wrap gap-3">
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as OrderStatus | 'all')}
                className={`px-4 py-2 rounded-lg transition-all capitalize ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColor = getStatusColor(order.status);
            
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-soft overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-navy-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${statusColor}`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-navy-600">
                          Placed on {order.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor}`}>
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-navy-900">
                        Rs. {order.total.toLocaleString('en-PK')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-navy-900 mb-4">Items ({order.items.length})</h4>
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.product.id} className="flex items-center space-x-4">
                            <img
                              src={item.product.images[item.product.thumbnailIndex || 0]}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-navy-900">{item.product.name}</h5>
                              <p className="text-navy-600 text-sm">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-medium text-navy-900">
                              Rs. {(item.product.price * item.quantity).toLocaleString('en-PK')}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-navy-600 text-sm">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="font-semibold text-navy-900 mb-4">Order Information</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <FiMapPin className="w-4 h-4 text-navy-400" />
                          <div>
                            <p className="font-medium text-navy-900">Shipping to:</p>
                            <p className="text-navy-600">{order.shippingAddress.fullName}</p>
                            <p className="text-navy-600">
                              {order.shippingAddress.city}, {order.shippingAddress.state}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="w-4 h-4 text-navy-400" />
                          <div>
                            <p className="font-medium text-navy-900">Payment Method:</p>
                            <p className="text-navy-600">
                              {getPaymentMethodDisplay(order.paymentInfo.method)}
                            </p>
                          </div>
                        </div>

                        {order.estimatedDelivery && (
                          <div className="flex items-center space-x-2">
                            <FiTruck className="w-4 h-4 text-navy-400" />
                            <div>
                              <p className="font-medium text-navy-900">Estimated Delivery:</p>
                              <p className="text-navy-600">
                                {order.estimatedDelivery.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}

                        {order.trackingNumber && (
                          <div className="flex items-center space-x-2">
                            <FiPackage className="w-4 h-4 text-navy-400" />
                            <div>
                              <p className="font-medium text-navy-900">Tracking Number:</p>
                              <p className="text-navy-600 font-mono">{order.trackingNumber}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-navy-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center space-x-4 text-sm text-navy-600">
                        <span>Subtotal: Rs. {order.subtotal.toLocaleString('en-PK')}</span>
                        <span>Tax: Rs. {order.tax.toLocaleString('en-PK')}</span>
                                                 <span>Shipping: {order.shipping === 0 ? 'Free' : `Rs. ${order.shipping.toLocaleString('en-PK')}`}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <motion.button
                          className="flex items-center space-x-2 px-4 py-2 border border-navy-300 text-navy-700 rounded-lg hover:bg-navy-50 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiEye className="w-4 h-4" />
                          <span>View Details</span>
                        </motion.button>
                        
                        {['pending', 'confirmed'].includes(order.status) && (
                          <motion.button
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiX className="w-4 h-4" />
                            <span>Cancel</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && statusFilter !== 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiPackage className="w-16 h-16 text-navy-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-navy-900 mb-2">
              No {statusFilter} orders found
            </h3>
            <p className="text-navy-600">Try selecting a different status filter.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage; 