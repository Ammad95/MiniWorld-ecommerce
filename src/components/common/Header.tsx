import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShoppingCart, 
  FiMenu, 
  FiX, 
  FiSearch
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/categories';
import { supabase } from '../../lib/supabase';
import Logo from './Logo';

interface Announcement {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<string>('✨ Free shipping on orders over PKR 5,000 | New arrivals weekly');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const { state } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  // Fetch active announcements from database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('id, title, content, is_active')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setAnnouncements(data);
          setCurrentAnnouncement(data[0].content);
        }
      } catch (error) {
        console.warn('Could not fetch announcements, using default:', error);
        // Keep the default announcement if database fetch fails
      }
    };

    fetchAnnouncements();
  }, []);

  // Cycle through announcements if there are multiple
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % announcements.length;
          setCurrentAnnouncement(announcements[nextIndex].content);
          return nextIndex;
        });
      }, 8000); // Change announcement every 8 seconds

      return () => clearInterval(interval);
    }
  }, [announcements]);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-deepPurple-100 sticky top-0 z-50 shadow-sm">
      {/* Top announcement bar - Deep purple gradient theme */}
      <div className="gradient-deep-purple py-2 px-4 text-center">
        <motion.p 
          key={currentAnnouncementIndex} // Key for smooth animation when content changes
          className="text-white text-sm font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
        >
          {currentAnnouncement}
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
                        layoutId="activeTab"
                        className="absolute inset-0 bg-deepPurple-100 rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={toggleSearch}
              className="p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-all duration-200"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-all duration-200"
            >
              <FiShoppingCart className="w-5 h-5" />
              {state.items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                >
                  {state.items.reduce((total, item) => total + item.quantity, 0)}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="py-4 border-t border-deepPurple-100"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for baby products..."
                  className="w-full px-4 py-3 pl-10 bg-white border border-deepPurple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepPurple-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepPurple-400 w-5 h-5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 border-t border-deepPurple-100"
            >
              <nav className="space-y-2">
                {categories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/category/${category.id}`}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-deepPurple-700 bg-deepPurple-100'
                          : 'text-deepPurple-600 hover:text-deepPurple-700 hover:bg-deepPurple-50'
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header; 
