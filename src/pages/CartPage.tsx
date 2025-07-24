import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const result = updateQuantity(productId, newQuantity);
    if (!result.success && result.message) {
      alert(result.message);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-navy-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <FiShoppingBag className="w-24 h-24 text-navy-400 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-navy-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-navy-600 text-lg mb-8">
              Discover amazing products for your little ones
            </p>
            <Link to="/">
              <motion.button
                className="btn-primary flex items-center space-x-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <div className="container mx-auto container-padding section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8">
            Shopping Cart
          </h1>
          <p className="text-navy-600">
            {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <motion.div
                key={item.product.id}
                className="modern-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-navy-900 font-bold text-lg mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-navy-600 text-sm mb-2">
                      {item.product.description}
                    </p>
                    <p className="text-orange-600 font-bold">
                      PKR {item.product.price.toLocaleString('en-PK')}
                    </p>
                    
                    {/* Stock availability indicator */}
                    {item.product.stockQuantity <= 5 && (
                      <p className="text-yellow-600 text-xs mt-1">
                        Only {item.product.stockQuantity} left in stock
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-navy-100 hover:bg-navy-200 rounded-full flex items-center justify-center text-navy-700 transition-colors"
                    >
                      <FiMinus className="w-4 h-4" />
                    </motion.button>
                    
                    <span className="text-navy-900 font-bold w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        item.quantity >= item.product.stockQuantity 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-navy-100 hover:bg-navy-200 text-navy-700'
                      }`}
                      disabled={item.quantity >= item.product.stockQuantity}
                    >
                      <FiPlus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.product.id)}
                    className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="space-y-4">
            <motion.div
              className="modern-card p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-navy-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-navy-600">
                  <span>Subtotal ({state.itemCount} items)</span>
                  <span>PKR {state.total.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between text-navy-600">
                  <span>Shipping</span>
                  <span className="text-orange-600">Free</span>
                </div>
                <div className="border-t border-navy-200 pt-4">
                  <div className="flex justify-between text-navy-900 text-lg font-bold">
                    <span>Total</span>
                    <span>PKR {state.total.toLocaleString('en-PK')}</span>
                  </div>
                </div>
              </div>

              <motion.button
                className="btn-primary w-full text-lg py-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </motion.button>

              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 border border-navy-300 text-navy-700 hover:text-navy-800 hover:border-navy-400 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCart}
                className="w-full px-6 py-3 text-red-500 hover:text-red-600 transition-colors mt-4"
              >
                Clear Cart
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 
