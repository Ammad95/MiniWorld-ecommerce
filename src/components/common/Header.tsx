import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiSearch,
  FiUser,
  FiHeart
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/categories';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-deepPurple-100 sticky top-0 z-50 shadow-sm">
      {/* Top announcement bar - Deep purple gradient theme */}
      <div className="gradient-deep-purple py-2 px-4 text-center">
        <motion.p 
          className="text-white text-sm font-medium"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨ Free shipping on orders over $100 | New arrivals weekly
        </motion.p>
      </div>

      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation - Clean and minimal */}
          <nav className="hidden lg:flex items-center space-x-1">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/category/${category.id}`}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActive
                      ? 'text-deepPurple-600 bg-deepPurple-50'
                      : 'text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {category.name}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-deepPurple-500 to-violet-600"
                        layoutId="activeTab"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions - Clean icons */}
          <div className="flex items-center space-x-2">
            {/* Admin Link */}
            <Link to="/admin" className="hidden lg:block">
              <motion.button
                className="px-3 py-1 text-xs text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Admin
              </motion.button>
            </Link>
            
            {/* Search */}
            <motion.button
              onClick={toggleSearch}
              className="p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSearch className="w-5 h-5" />
            </motion.button>

            {/* Wishlist */}
            <motion.button
              className="p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart className="w-5 h-5" />
            </motion.button>

            {/* Account */}
            <Link to="/customer/login">
              <motion.button
                className="p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser className="w-5 h-5" />
              </motion.button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <motion.div 
                className="relative p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiShoppingCart className="w-5 h-5" />
                {state.itemCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-deepPurple-500 to-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {state.itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Search Bar - Fixed formatting */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-deepPurple-100 py-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-12 pr-4 text-deepPurple-700 placeholder-deepPurple-400 bg-white border border-deepPurple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent transition-all duration-200"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation - Clean design */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-deepPurple-100 py-4"
            >
              <nav className="flex flex-col space-y-1">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NavLink
                      to={`/category/${category.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'text-deepPurple-600 bg-deepPurple-50'
                            : 'text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50'
                        }`
                      }
                    >
                      {category.displayName}
                    </NavLink>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: categories.length * 0.1 }}
                  className="pt-4 border-t border-deepPurple-100"
                >
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <div className="block px-4 py-3 text-base font-medium text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-all duration-200">
                      Admin Panel
                    </div>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 