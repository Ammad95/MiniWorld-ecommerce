import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight,
  FiBarChart,
  FiMail,
  FiLock,
  FiTrendingUp
} from 'react-icons/fi';
import { useSupabaseAuth } from '../../context/SupabaseAuthContext';
import Logo from '../common/Logo';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
  submenu?: NavigationItem[];
}

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { state, signOut } = useSupabaseAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiHome,
      path: '/admin/dashboard'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: FiPackage,
      path: '/admin/orders',
      badge: 'New'
    },
    {
      id: 'products',
      label: 'Products',
      icon: FiShoppingBag,
      path: '/admin/products'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: FiTrendingUp,
      path: '/admin/inventory',
      badge: 'Stock'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: FiUsers,
      path: '/admin/customers'
    },
    {
      id: 'payments',
      label: 'Payment Accounts',
      icon: FiCreditCard,
      path: '/admin/payments'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: FiBarChart,
      path: '/admin/analytics'
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: FiMail,
      path: '/admin/communications'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FiSettings,
      path: '/admin/settings',
      submenu: [
        {
          id: 'change-password',
          label: 'Change Password',
          icon: FiLock,
          path: '/admin/change-password'
        }
      ]
    }
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActiveRoute = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-deepPurple-200">
        <div className="flex items-center space-x-3">
          <Logo />
        </div>
        {/* Removed the old toggle button since we have a new one outside */}
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-deepPurple-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-deepPurple-500 to-violet-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {state.user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col"
            >
              <span className="font-semibold text-gray-900">{state.user?.name || 'Admin'}</span>
              <span className="text-sm text-gray-600">{state.user?.email || 'admin@miniworld.com'}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.id}>
            <Link
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                isActiveRoute(item.path)
                  ? 'bg-deepPurple-100 text-deepPurple-700 shadow-sm'
                  : 'text-gray-700 hover:bg-deepPurple-50 hover:text-deepPurple-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 px-1 py-0.5 text-xs bg-orange-500 text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
            
            {/* Submenu */}
            {item.submenu && sidebarOpen && isActiveRoute(item.path) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-8 mt-2 space-y-1"
              >
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                      location.pathname === subItem.path
                        ? 'bg-deepPurple-100 text-deepPurple-700'
                        : 'text-gray-600 hover:bg-deepPurple-50 hover:text-deepPurple-700'
                    }`}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-deepPurple-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <FiLogOut className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: sidebarOpen ? 280 : 80 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white border-r border-gray-200 shadow-sm relative"
      >
        <SidebarContent />
        
        {/* Always visible toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 z-10"
        >
          <FiChevronRight className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Logo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="h-full overflow-y-auto">
                <SidebarContent />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <Logo />
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 