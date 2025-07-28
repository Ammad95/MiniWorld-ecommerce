import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, 
  FiSearch, 
  FiUser, 
  FiDollarSign,
  FiTruck,
  FiCheck,
  FiX,
  FiClock,
  FiRefreshCw,
  FiEye,
  FiArrowLeft,
  FiPhone,
  FiMail,
  FiMapPin
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useSupabaseOrder } from '../../context/SupabaseOrderContext';
import { Order, OrderStatus } from '../../types';

type StatusFilter = 'all' | 'completed' | 'dispatched' | 'payment_due' | 'cancelled' | 'returned';

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
  description: string;
}

const OrderManagement: React.FC = () => {
  const { state, updateOrderStatus } = useSupabaseOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Status configurations
  const statusConfigs: Record<string, StatusConfig> = {
    completed: {
      label: 'Completed',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: FiCheck,
      description: 'Successfully delivered orders'
    },
    dispatched: {
      label: 'Dispatched',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: FiTruck,
      description: 'Orders shipped and in transit'
    },
    payment_due: {
      label: 'Payment Due',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      icon: FiDollarSign,
      description: 'Orders awaiting payment'
    },
    cancelled: {
      label: 'Cancelled',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: FiX,
      description: 'Cancelled orders'
    },
    returned: {
      label: 'Returned',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: FiRefreshCw,
      description: 'Returned orders'
    },
    processing: {
      label: 'Processing',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: FiClock,
      description: 'Orders being processed'
    },
    pending: {
      label: 'Pending',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: FiClock,
      description: 'New orders awaiting confirmation'
    }
  };

  // Map legacy statuses to new admin statuses
  const mapOrderStatus = (status: OrderStatus): string => {
    switch (status) {
      case 'delivered':
        return 'completed';
      case 'shipped':
        return 'dispatched';
      case 'pending':
      case 'confirmed':
        return 'payment_due';
      case 'cancelled':
        return 'cancelled';
      case 'returned':
        return 'returned';
      default:
        return 'processing';
    }
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = state.orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => mapOrderStatus(order.status) === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [state.orders, statusFilter, searchTerm]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = {
      all: state.orders.length,
      completed: 0,
      dispatched: 0,
      payment_due: 0,
      cancelled: 0,
      returned: 0
    };

    state.orders.forEach(order => {
      const mappedStatus = mapOrderStatus(order.status);
      if (mappedStatus in counts) {
        counts[mappedStatus as keyof typeof counts]++;
      }
    });

    return counts;
  }, [state.orders]);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };



  const formatPrice = (price: number) => `PKR ${price.toLocaleString('en-PK')}`;
  const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getStatusDisplay = (order: Order) => {
    const mappedStatus = mapOrderStatus(order.status);
    const config = statusConfigs[mappedStatus];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color} ${config.bgColor}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  const StatusTab: React.FC<{ status: StatusFilter; count: number }> = ({ status, count }) => {
    const isActive = statusFilter === status;
    const config = status === 'all' 
      ? { label: 'All Orders', color: 'text-deepPurple-600', icon: FiPackage }
      : statusConfigs[status];
    
    const Icon = config.icon;

    return (
      <motion.button
        onClick={() => setStatusFilter(status)}
        className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-deepPurple-100 text-deepPurple-700 shadow-sm' 
            : 'text-gray-600 hover:text-deepPurple-600 hover:bg-deepPurple-50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon className="w-5 h-5" />
        <span>{config.label}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          isActive ? 'bg-deepPurple-200 text-deepPurple-800' : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-deepPurple-500"
            layoutId="activeStatusTab"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto container-padding py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-deepPurple-600 hover:text-deepPurple-800">
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600 mt-1">Manage and track all orders</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders, names, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent w-80"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto container-padding py-8">
        {/* Status Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <StatusTab status="all" count={statusCounts.all} />
            <StatusTab status="payment_due" count={statusCounts.payment_due} />
            <StatusTab status="dispatched" count={statusCounts.dispatched} />
            <StatusTab status="completed" count={statusCounts.completed} />
            <StatusTab status="cancelled" count={statusCounts.cancelled} />
            <StatusTab status="returned" count={statusCounts.returned} />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">#{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-sm text-gray-600">{order.shippingAddress.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiPackage className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{order.items.length} items</p>
                        <p className="text-sm text-gray-600">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusDisplay(order)}
                    
                    <motion.button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      className="p-2 text-gray-600 hover:text-deepPurple-600 hover:bg-deepPurple-50 rounded-lg transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiEye className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {statusFilter === 'all' 
                  ? "No orders have been placed yet." 
                  : `No orders with status "${statusConfigs[statusFilter]?.label}" found.`}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    <p className="text-gray-600">#{selectedOrder.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusDisplay(selectedOrder)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize">{selectedOrder.paymentInfo.method.replace('_', ' ')}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tracking Number:</span>
                          <span className="font-medium">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Update Actions */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Update Status</h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(statusConfigs).filter(([key]) => key !== 'processing').map(([status, config]) => {
                          const Icon = config.icon;
                          return (
                            <button
                              key={status}
                              onClick={() => {
                                const statusMap: Record<string, OrderStatus> = {
                                  completed: 'delivered',
                                  dispatched: 'shipped',
                                  payment_due: 'confirmed',
                                  cancelled: 'cancelled',
                                  returned: 'returned'
                                };
                                handleStatusUpdate(selectedOrder.id, statusMap[status]);
                              }}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                mapOrderStatus(selectedOrder.status) === status
                                  ? `${config.color} ${config.bgColor}`
                                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span>{config.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Order Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <FiUser className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiMail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-600">{selectedOrder.shippingAddress.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-gray-600">
                            {selectedOrder.shippingAddress.address}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                            {selectedOrder.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-sm">📦</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(item.product.price)}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">{formatPrice(selectedOrder.shipping)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between text-lg font-semibold">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-gray-900">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManagement; 
