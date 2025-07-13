import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Admin panel components
          if (id.includes('/src/AdminApp.tsx') || 
              id.includes('/pages/admin/') || 
              id.includes('/components/admin/') ||
              id.includes('/context/SupabaseAuthContext.tsx')) {
            return 'admin';
          }
          
          // React core libraries
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }
          
          // UI libraries
          if (id.includes('framer-motion') || id.includes('react-icons') || id.includes('react-image-gallery')) {
            return 'vendor-ui';
          }
          
          // Supabase
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          
          // Other vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // Let main app code stay in the main chunk
          return undefined;
        },
      },
    },
    // Set reasonable chunk size limit
    chunkSizeWarningLimit: 500,
  }
}) 