import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Mother and Baby Logo */}
      <div className="relative">
        <motion.div
          className="w-12 h-12 flex items-center justify-center"
          whileHover={{ rotate: 3, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.svg
            width="48"
            height="48"
            viewBox="0 0 200 200"
            className="drop-shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Outer circle */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="#1a1a1a"
              stroke="#333"
              strokeWidth="2"
            />
            
            {/* Mother and child silhouette */}
            <g fill="white">
              {/* Mother's head and hair */}
              <ellipse cx="75" cy="45" rx="25" ry="30" />
              <path d="M 50 35 Q 45 20 60 15 Q 80 10 100 20 Q 105 30 95 40 Q 85 45 75 45" />
              
              {/* Mother's body */}
              <path d="M 60 70 Q 55 75 55 85 L 50 120 Q 48 140 55 155 Q 65 170 80 175 Q 95 180 110 175 Q 120 170 125 155 L 120 120 Q 115 100 110 85 Q 105 75 100 70 Q 85 65 75 65 Q 65 65 60 70" />
              
              {/* Mother's arm holding baby */}
              <path d="M 85 85 Q 90 90 95 95 L 105 105 Q 110 110 115 115 Q 120 120 125 125 Q 130 130 135 125 Q 140 120 135 115 L 130 105 Q 125 95 120 90 Q 115 85 110 85" />
              
              {/* Baby's head */}
              <circle cx="135" cy="110" r="18" />
              
              {/* Baby's body */}
              <ellipse cx="140" cy="135" rx="12" ry="20" />
              
              {/* Mother's other arm */}
              <path d="M 65 85 Q 60 90 55 95 Q 50 100 45 105 Q 40 110 42 115 Q 45 120 50 115 Q 55 110 60 105 L 70 95 Q 75 90 75 85" />
              
              {/* Additional flowing curves for artistic effect */}
              <path d="M 160 60 Q 170 80 165 100 Q 160 120 150 130 Q 140 135 135 125" fill="white" opacity="0.7" />
            </g>
            
            {/* Inner highlight circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </motion.svg>
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