import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiCheck, FiAlertTriangle, FiX } from 'react-icons/fi';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatPKRProduct } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addItem(product, 1);
    }
  };



  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStockStatus = () => {
    switch (product.stockStatus) {
      case 'in_stock':
        return {
          icon: FiCheck,
          text: `${product.stockQuantity} In Stock`,
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'low_stock':
        return {
          icon: FiAlertTriangle,
          text: `Only ${product.stockQuantity} Left`,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      case 'out_of_stock':
        return {
          icon: FiX,
          text: 'Out of Stock',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          icon: FiCheck,
          text: 'In Stock',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
    }
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockStatus === 'low_stock';

  return (
    <Link to={`/product/${product.id}`} className={isOutOfStock ? 'pointer-events-none' : ''}>
      <motion.div
        className={`modern-card group cursor-pointer overflow-hidden relative ${
          isOutOfStock ? 'opacity-60' : ''
        }`}
        whileHover={isOutOfStock ? {} : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-30 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              <span className="text-gray-900 font-semibold">Out of Stock</span>
            </div>
          </div>
        )}

        {/* Product Badges - Updated design */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
          {product.isNew && !isOutOfStock && (
            <motion.span
              className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              NEW
            </motion.span>
          )}
          {product.originalPrice && !isOutOfStock && (
            <motion.span
              className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full shadow-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
            >
              SALE
            </motion.span>
          )}
          {isLowStock && !isOutOfStock && (
            <motion.span
              className="px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full shadow-sm"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 500 }}
            >
              LOW STOCK
            </motion.span>
          )}
        </div>



        {/* Product Image - Clean presentation */}
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <motion.img
            src={product.images[product.thumbnailIndex || 0] || product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isOutOfStock ? 'grayscale' : 'group-hover:scale-105'
            }`}
            loading="lazy"
          />
          
          {/* Quick Add Button - Modern design */}
          {!isOutOfStock && (
            <motion.button
              onClick={handleAddToCart}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 btn-primary opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
            >
              <FiShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </motion.button>
          )}
        </div>

        {/* Product Info - Clean typography */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-deepPurple-900 group-hover:text-deepPurple-600 transition-colors duration-200 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <p className="text-sm text-deepPurple-600 mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Rating - Clean design */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              ({product.reviews})
            </span>
          </div>

          {/* Price - Clean typography */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-deepPurple-900'}`}>
                {formatPKRProduct(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-deepPurple-500 line-through">
                  {formatPKRProduct(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status - New section */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bgColor} ${stockStatus.color}`}>
              <stockStatus.icon className="w-4 h-4" />
              <span>{stockStatus.text}</span>
            </div>
          </div>

          {/* Key Features - Clean badges */}
          <div className="flex flex-wrap gap-2">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  isOutOfStock 
                    ? 'bg-gray-100 text-gray-400' 
                    : 'bg-deepPurple-50 text-deepPurple-700'
                }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard; 
