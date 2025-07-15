import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* MHB Logo */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-deepPurple-600 via-deepPurple-700 to-violet-800 shadow-lg border-2 border-deepPurple-500"
          whileHover={{ rotate: 3, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.span
            className="text-white font-bold text-lg tracking-wider"
            style={{
              fontFamily: 'Georgia, serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            MHB
          </motion.span>
          
          {/* Subtle inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Brand name - Fixed visibility */}
      <div className="hidden sm:block">
        <motion.h1 
          className="text-xl font-bold bg-gradient-to-r from-deepPurple-700 to-violet-600 bg-clip-text text-transparent tracking-tight"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          MiniHub
        </motion.h1>
        <motion.p 
          className="text-xs text-deepPurple-500 -mt-1 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Baby essentials
        </motion.p>
      </div>
    </motion.div>
  );
};

export default Logo; 