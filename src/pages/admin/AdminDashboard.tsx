import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSettings,
  FiLogOut,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiCalendar
} from 'react-icons/fi';
import { useSupabaseProducts } from '../../context/SupabaseProductContext';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import CreateSubAdminModal from '../../components/admin/CreateSubAdminModal';
import PaymentAccountsModal from '../../components/admin/PaymentAccountsModal';

const AdminDashboard: React.FC = () => {
  const { state: productState } = useSupabaseProducts();
  const { state, signOut, deleteUser } = useSupabaseAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Statistics (mix of real and mock data)
  const stats = [
    {
      title: 'Admin Users',
      value: state.user ? '1' : '0',
      change: '+12%',
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Products',
      value: productState.products.length.toString(),
      change: '+8%',
      icon: FiShoppingBag,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15%',
      icon: FiDollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Growth',
      value: '23%',
      change: '+5%',
      icon: FiTrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateSubAdminSuccess = () => {
    setShowCreateModal(false);
    // Refresh data or show success message
  };

  // TODO: Implement proper user management - for now showing empty array
  const admins: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto container-padding py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {state.user?.name}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSettings className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto container-padding section-padding">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="modern-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="modern-card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              <div className="p-3 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200 transition-colors duration-200">
                <FiShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Products</h3>
                <p className="text-sm text-gray-600">{productState.products.length} products</p>
              </div>
            </Link>
            
            <Link
              to="/admin/orders"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
            >
              <div className="p-3 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors duration-200">
                <FiShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Orders</h3>
                <p className="text-sm text-gray-600">Track & update orders</p>
              </div>
            </Link>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group text-left"
            >
              <div className="p-3 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors duration-200">
                <FiPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Sub-Admin</h3>
                <p className="text-sm text-gray-600">Create new admin user</p>
              </div>
            </button>
            
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group text-left"
            >
              <div className="p-3 bg-orange-100 rounded-lg mr-4 group-hover:bg-orange-200 transition-colors duration-200">
                <FiCreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Payment Accounts</h3>
                <p className="text-sm text-gray-600">Manage bank accounts</p>
              </div>
            </button>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FiSettings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">System Settings</h3>
                <p className="text-sm text-gray-600">Configure system</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sub-Admins Section */}
        {state.user?.role === 'super_admin' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="modern-card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Admin Users</h2>
                <p className="text-gray-600">Manage your administrative team</p>
              </div>
              
              <motion.button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Sub-Admin</span>
              </motion.button>
            </div>

            {/* Admins List */}
            {admins.length > 0 ? (
              <div className="space-y-4">
                {admins.map((admin, index) => (
                  <motion.div
                    key={admin.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-700">
                          {admin.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FiMail className="w-4 h-4" />
                            <span>{admin.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiPhone className="w-4 h-4" />
                            <span>{admin.mobile}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>Created {formatDate(admin.createdAt)}</span>
                          </div>
                        </div>
                        {admin.isFirstLogin && (
                          <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Pending First Login
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => console.log('Edit user:', admin.id)}
                      >
                        <FiEdit className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteUser(admin.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sub-Admins Yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first sub-administrator</p>
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Create First Sub-Admin
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="modern-card p-6 text-center">
            <FiShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
            <p className="text-gray-600 mb-4">Add, edit, and organize your product catalog</p>
            <button className="btn-secondary">Coming Soon</button>
          </div>
          
          <div className="modern-card p-6 text-center">
            <FiUsers className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Management</h3>
            <p className="text-gray-600 mb-4">View and manage customer accounts</p>
            <button className="btn-secondary">Coming Soon</button>
          </div>
          
          <div className="modern-card p-6 text-center">
            <FiTrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">Track sales performance and insights</p>
            <button className="btn-secondary">Coming Soon</button>
          </div>
        </motion.div>
      </div>

      {/* Create Sub-Admin Modal */}
      <CreateSubAdminModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSubAdminSuccess}
      />

      {/* Payment Accounts Modal */}
      <PaymentAccountsModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
};

export default AdminDashboard; 