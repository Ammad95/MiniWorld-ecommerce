import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram,
  FiHeart
} from 'react-icons/fi';
import { categories } from '../../data/categories';

const Footer: React.FC = () => {
  return (
    <footer className="gradient-deep-purple text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto container-padding section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="6" r="3" fill="#581c87"/>
                  <path d="M9 10c-2.5 0-4.5 2-4.5 4.5V20h9v-5.5c0-2.5-2-4.5-4.5-4.5z" fill="#581c87"/>
                  <circle cx="17" cy="8" r="2" fill="#a855f7"/>
                  <path d="M17 11c-1.5 0-2.5 1-2.5 2.5V17h5v-3.5c0-1.5-1-2.5-2.5-2.5z" fill="#a855f7"/>
                  <path d="M12.5 9c-.3 0-.5.2-.5.5 0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.3-.2-.5-.5-.5-.3 0-.5.2-.5.5 0 .3-.2.5-.5.5s-.5-.2-.5-.5c0-.3-.2-.5-.5-.5z" fill="#c084fc"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">MiniHub</h3>
                <p className="text-sm text-violet-200">Baby essentials</p>
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">
              Premium baby products designed with care, crafted for comfort, and built to last. 
              Everything your little one needs for a bright future.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFacebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiInstagram className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Shop by Age</h4>
            <nav className="space-y-3">
              {categories.map((category) => (
                <motion.div key={category.id} whileHover={{ x: 4 }}>
                  <Link 
                    to={`/category/${category.id}`}
                    className="block text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {category.displayName}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Customer Service</h4>
            <nav className="space-y-3">
              <motion.div whileHover={{ x: 4 }}>
                <Link to="/help" className="block text-white/80 hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }}>
                <Link to="/shipping" className="block text-white/80 hover:text-white transition-colors duration-200">
                  Shipping Info
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }}>
                <Link to="/returns" className="block text-white/80 hover:text-white transition-colors duration-200">
                  Returns & Exchanges
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }}>
                <Link to="/size-guide" className="block text-white/80 hover:text-white transition-colors duration-200">
                  Size Guide
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 4 }}>
                <Link to="/contact" className="block text-white/80 hover:text-white transition-colors duration-200">
                  Contact Us
                </Link>
              </motion.div>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/90">
                <FiMail className="w-5 h-5 flex-shrink-0" />
                <span>support@minihubpk.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <FiPhone className="w-5 h-5 flex-shrink-0" />
                <span>1-800-MINI-WORLD</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <FiMapPin className="w-5 h-5 flex-shrink-0" />
                <span>123 Baby Street, Care City, CC 12345</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-3">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-l-lg focus:outline-none focus:border-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                />
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-deepPurple-500 to-violet-600 text-white font-medium rounded-r-lg hover:from-deepPurple-600 hover:to-violet-700 transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto container-padding py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-white/70 text-sm">
              <span>© 2024 MiniHub. All rights reserved.</span>
              <span>•</span>
              <Link to="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </div>
            
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FiHeart className="w-4 h-4 text-violet-300" />
              </motion.div>
              <span>for little ones</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
