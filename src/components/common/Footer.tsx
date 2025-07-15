import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiInstagram,
  FiHeart
} from 'react-icons/fi';
import { categories } from '../../data/categories';
import Logo from './Logo';
import emailService from '../../services/EmailService';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscriptionMessage('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage('');

    try {
      const success = await emailService.sendNewsletterConfirmation(email);
      
      if (success) {
        setSubscriptionMessage('🎉 Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setSubscriptionMessage('❌ Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionMessage('❌ Something went wrong. Please try again.');
    } finally {
      setIsSubscribing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscriptionMessage('');
      }, 5000);
    }
  };

  return (
    <footer className="gradient-deep-purple text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto container-padding section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Logo />
            </div>
            <p className="text-white/90 leading-relaxed">
              Premium baby products designed with care, crafted for comfort, and built to last. 
              Everything your little one needs for a bright future.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://facebook.com/minihubpk" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFacebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="https://instagram.com/minihubpk" 
                target="_blank"
                rel="noopener noreferrer"
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
                <span>+923364599579</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <FiMapPin className="w-5 h-5 flex-shrink-0" />
                <span>We do not have any physical shop yet</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-white mb-3">Stay Updated</h5>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:border-white/50 text-white placeholder-white/60 backdrop-blur-sm"
                    disabled={isSubscribing}
                  />
                  <motion.button
                    type="submit"
                    className="px-6 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubscribing ? { scale: 1.02 } : {}}
                    whileTap={!isSubscribing ? { scale: 0.98 } : {}}
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </motion.button>
                </div>
                {subscriptionMessage && (
                  <motion.p 
                    className={`text-sm ${subscriptionMessage.includes('🎉') ? 'text-green-300' : 'text-red-300'}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {subscriptionMessage}
                  </motion.p>
                )}
              </form>
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
