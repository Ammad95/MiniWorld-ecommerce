import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  // You can switch between 'MHB' and 'Mi' by changing this variable
  const logoText = 'Mi'; // Change to 'MHB' if you prefer the full version

  return (
    <motion.div 
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Logo Badge */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-deepPurple-600 via-deepPurple-700 to-violet-800 shadow-xl border border-deepPurple-400/30"
          whileHover={{ rotate: 2, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.span
            className="text-white font-black tracking-tight select-none"
            style={{
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              fontSize: logoText === 'Mi' ? '18px' : '14px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: logoText === 'Mi' ? '0px' : '1px'
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {logoText}
          </motion.span>
          
          {/* Glassmorphism effect */}
          <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none" />
          
          {/* Subtle border glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </motion.div>
        
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-xl bg-deepPurple-600/20 blur-sm scale-110 pointer-events-none" />
      </div>

      {/* Brand name */}
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
          className="text-xs text-deepPurple-500 -mt-1 font-medium tracking-wide"
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