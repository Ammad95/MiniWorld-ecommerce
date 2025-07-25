import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiDollarSign, 
  FiShoppingBag, 
  FiTrendingUp, 
  FiUsers, 
  FiClock,
  FiTruck,
  FiCheckCircle
} from 'react-icons/fi';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import { useSupabaseOrder } from '../../context/SupabaseOrderContext';
import { supabase } from '../../lib/supabase';
import CreateSubAdminModal from '../../components/admin/CreateSubAdminModal';
import PaymentAccountsModal from '../../components/admin/PaymentAccountsModal';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  totalRevenue: number;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { state: authState, signOut } = useSupabaseAuth();
  const { state: orderState } = useSupabaseOrder();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateSubAdminModal, setShowCreateSubAdminModal] = useState(false);
  const [showPaymentAccountsModal, setShowPaymentAccountsModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    
    // Update recent orders from context
    const recentOrdersFromContext = orderState.orders
      .slice(0, 5) // Take first 5 (already sorted by created_at desc in context)
      .map(order => ({
        id: order.id,
        customer_name: order.shippingAddress.fullName,
        customer_email: order.shippingAddress.email,
        total_amount: order.total,
        status: order.status,
        created_at: order.createdAt.toISOString()
      }));
    
    setRecentOrders(recentOrdersFromContext);
  }, [orderState.orders]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);

      // Calculate order statistics from the order context
      const orders = orderState.orders;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed');
      const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');
      const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);
      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

      // Initialize dashboard stats
      let dashboardStats: DashboardStats = {
        totalOrders: orders.length,
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
        todayOrders: todayOrders.length,
        totalRevenue: totalRevenue,
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
      };

      // Safely fetch product data
      try {
        const { data: productsData, error: productError } = await supabase
          .from('products')
          .select('id, is_active, stock_quantity');

        if (!productError && productsData) {
          const activeProducts = productsData.filter(p => p.is_active);
          dashboardStats.totalProducts = productsData.length;
          dashboardStats.activeProducts = activeProducts.length;
          dashboardStats.lowStockProducts = productsData.filter(p => (p.stock_quantity || 0) < 10).length;
        }
      } catch (error) {
        console.warn('Error fetching products:', error);
      }

      setStats(dashboardStats);

    } catch (error) {
      console.error('Error in fetchDashboardStats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSubAdminSuccess = () => {
    setShowCreateSubAdminModal(false);
    // Optionally refresh data or show success message
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-deepPurple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {authState.user?.email}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowCreateSubAdminModal(true)}
            className="bg-deepPurple-600 text-white px-4 py-2 rounded-lg hover:bg-deepPurple-700 transition-colors flex items-center space-x-2"
          >
            <FiPackage className="w-4 h-4" />
            <span>Add Sub-Admin</span>
          </button>
          
          <button 
            onClick={() => setShowPaymentAccountsModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <FiDollarSign className="w-4 h-4" />
            <span>Payment Accounts</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              <p className="text-xs text-gray-400">Today: +{stats.todayOrders}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-600">+{stats.completedOrders} completed</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs text-gray-400">{stats.activeProducts} active</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiPackage className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-orange-600">Needs attention</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="bg-green-100 p-2 rounded-lg">
                <FiPackage className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-900">Manage Products</p>
                <p className="text-sm text-green-600">{stats.totalProducts} products</p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="bg-purple-100 p-2 rounded-lg">
                <FiUsers className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-purple-900">Manage Orders</p>
                <p className="text-sm text-purple-600">Track & update orders</p>
              </div>
            </Link>

            <button
              onClick={() => setShowCreateSubAdminModal(true)}
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-lg">
                <FiPackage className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-orange-900">Add Sub-Admin</p>
                <p className="text-sm text-orange-600">Create new admin user</p>
              </div>
            </button>

            <button
              onClick={() => setShowPaymentAccountsModal(true)}
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiDollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Payment Accounts</p>
                <p className="text-sm text-blue-600">Manage bank accounts</p>
              </div>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-deepPurple-100 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="w-4 h-4 text-deepPurple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-sm text-gray-500">{order.customer_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(order.total_amount)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FiShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
          {recentOrders.length > 0 && (
            <div className="mt-4">
              <Link
                to="/admin/orders"
                className="text-deepPurple-600 hover:text-deepPurple-700 text-sm font-medium"
              >
                View all orders →
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* System Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <FiClock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Configure System</p>
              <p className="text-sm text-gray-500">System configuration settings</p>
            </div>
          </div>

          <Link
            to="/admin/change-password"
            className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiTruck className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </Link>

          <button
            onClick={signOut}
            className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FiCheckCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Sign Out</p>
              <p className="text-sm text-red-600">Exit admin panel</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Modals */}
      <CreateSubAdminModal
        isOpen={showCreateSubAdminModal}
        onClose={() => setShowCreateSubAdminModal(false)}
        onSuccess={handleSubAdminSuccess}
      />

      <PaymentAccountsModal
        isOpen={showPaymentAccountsModal}
        onClose={() => setShowPaymentAccountsModal(false)}
      />
    </div>
  );
};

export default AdminDashboard; 
