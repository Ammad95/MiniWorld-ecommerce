import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPackage, 
  FiTruck, 
  FiCheck, 
  FiClock, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiShoppingBag,
  FiEye,
  FiMapPin,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useOrder } from '../../context/OrderContext';
import { OrderStatus } from '../../types';

const CustomerDashboard: React.FC = () => {
  const { state: authState, logout } = useCustomerAuth();
  const { getUserOrders } = useOrder();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile'>('overview');

  const orders = getUserOrders();
  
  // Filter orders by status
  const inProgressOrders = orders.filter(order => 
    ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
  );
  const completedOrders = orders.filter(order => order.status === 'delivered');
  const pastOrders = orders.filter(order => order.status === 'cancelled');

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return FiClock;
      case 'confirmed': return FiCheck;
      case 'processing': return FiPackage;
      case 'shipped': return FiTruck;
      case 'delivered': return FiCheck;
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  const customer = authState.customer;

  if (!customer) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy-600 mb-4">Please log in to view your dashboard</p>
          <Link to="/customer/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-navy-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-navy-600 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-navy-900">
                  Welcome back, {customer.firstName}!
                </h1>
                <p className="text-navy-600">Manage your account and orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-navy-600 hover:text-navy-800 transition-colors">
                Continue Shopping
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  <FiPackage className="w-5 h-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  <FiSettings className="w-5 h-5" />
                  <span>Profile</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-navy-900">In Progress</h3>
                      <FiClock className="w-8 h-8 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{inProgressOrders.length}</p>
                    <p className="text-navy-600 text-sm">Active orders</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-navy-900">Completed</h3>
                      <FiCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{completedOrders.length}</p>
                    <p className="text-navy-600 text-sm">Delivered orders</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-navy-900">Total Orders</h3>
                      <FiPackage className="w-8 h-8 text-navy-500" />
                    </div>
                    <p className="text-3xl font-bold text-navy-900">{orders.length}</p>
                    <p className="text-navy-600 text-sm">All time</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <h3 className="text-lg font-semibold text-navy-900 mb-6">Recent Orders</h3>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        const statusColor = getStatusColor(order.status);
                        
                        return (
                          <div key={order.id} className="flex items-center justify-between p-4 border border-navy-100 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`p-2 rounded-lg ${statusColor}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-navy-900">#{order.orderNumber}</p>
                                <p className="text-sm text-navy-600">
                                  {order.items.length} items • ${order.total.toFixed(2)}
                                </p>
                                <p className="text-xs text-navy-500">
                                  {order.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor}`}>
                                {order.status}
                              </span>
                              <Link to={`/order/${order.id}`}>
                                <button className="p-2 text-navy-400 hover:text-navy-600 transition-colors">
                                  <FiEye className="w-4 h-4" />
                                </button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiShoppingBag className="w-16 h-16 text-navy-300 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-navy-900 mb-2">No orders yet</h4>
                      <p className="text-navy-600 mb-4">Start shopping to see your orders here</p>
                      <Link to="/">
                        <motion.button
                          className="btn-primary"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Start Shopping
                        </motion.button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-soft p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-navy-900">Order History</h3>
                  <Link to="/orders" className="text-orange-600 hover:text-orange-700 transition-colors">
                    View All Orders
                  </Link>
                </div>

                {/* Order Filters */}
                <div className="flex space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-navy-600">In Progress:</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-medium">
                      {inProgressOrders.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-navy-600">Completed:</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                      {completedOrders.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-navy-600">Cancelled:</span>
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                      {pastOrders.length}
                    </span>
                  </div>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      const statusColor = getStatusColor(order.status);
                      
                      return (
                        <div key={order.id} className="border border-navy-100 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${statusColor}`}>
                                <StatusIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-navy-900">Order #{order.orderNumber}</p>
                                <p className="text-sm text-navy-600">
                                  Placed on {order.createdAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColor}`}>
                                {order.status}
                              </span>
                              <p className="text-lg font-bold text-navy-900 mt-1">
                                ${order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-navy-600">
                              {order.items.length} items • {order.paymentInfo.method.replace('_', ' ')}
                            </div>
                            <Link to={`/order/${order.id}`}>
                              <motion.button
                                className="flex items-center space-x-2 px-4 py-2 border border-navy-300 text-navy-700 rounded-lg hover:bg-navy-50 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <FiEye className="w-4 h-4" />
                                <span>View Details</span>
                              </motion.button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiShoppingBag className="w-16 h-16 text-navy-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-navy-900 mb-2">No orders yet</h4>
                    <p className="text-navy-600">Your order history will appear here</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-soft p-6"
              >
                <h3 className="text-lg font-semibold text-navy-900 mb-6">Profile Information</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        First Name
                      </label>
                      <div className="flex items-center space-x-3 p-3 border border-navy-200 rounded-lg bg-navy-25">
                        <FiUser className="w-5 h-5 text-navy-400" />
                        <span className="text-navy-900">{customer.firstName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Last Name
                      </label>
                      <div className="flex items-center space-x-3 p-3 border border-navy-200 rounded-lg bg-navy-25">
                        <FiUser className="w-5 h-5 text-navy-400" />
                        <span className="text-navy-900">{customer.lastName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 p-3 border border-navy-200 rounded-lg bg-navy-25">
                      <FiMail className="w-5 h-5 text-navy-400" />
                      <span className="text-navy-900">{customer.email}</span>
                    </div>
                  </div>

                  {customer.phone && (
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex items-center space-x-3 p-3 border border-navy-200 rounded-lg bg-navy-25">
                        <FiPhone className="w-5 h-5 text-navy-400" />
                        <span className="text-navy-900">{customer.phone}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-navy-700 mb-2">
                      Member Since
                    </label>
                    <div className="flex items-center space-x-3 p-3 border border-navy-200 rounded-lg bg-navy-25">
                      <FiMapPin className="w-5 h-5 text-navy-400" />
                      <span className="text-navy-900">
                        {customer.createdAt.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy-100">
                    <motion.button
                      className="btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit Profile
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 