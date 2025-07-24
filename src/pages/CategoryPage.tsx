import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { categories } from '../data/categories';
import { useSupabaseProducts } from '../context/SupabaseProductContext';
import ProductCard from '../components/products/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getProductsByCategory } = useSupabaseProducts();
  
  const category = categories.find(cat => cat.id === categoryId);
  const categoryProducts = categoryId ? getProductsByCategory(categoryId) : [];

  if (!category) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-orbitron font-bold text-gray-800 mb-4">
            Category Not Found
          </h1>
          <Link to="/">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg shadow-lg shadow-pink-300 hover:shadow-pink-400 transition-all duration-300 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto container-padding section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.displayName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category.description}
          </p>
        </motion.div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categoryProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Coming Soon!
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We're working hard to bring you amazing products for this age group. 
              Check back soon for new arrivals!
            </p>
            <Link to="/">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 
