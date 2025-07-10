import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiTruck, FiHeart } from 'react-icons/fi';
import { categories } from '../data/categories';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

const Home: React.FC = () => {
  const { state: productState } = useProducts();
  const featuredProducts = productState.products.filter(product => product.isFeatured);

  // Custom images for specific categories
  const getBackgroundImage = (categoryId: string, index: number) => {
    if (categoryId === '6-12-months') {
      // Beautiful baby image with blue eyes and white knitted hat
      return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop&auto=format'; // Placeholder - replace with user's image
    }
    return categories[index].bannerImages[0]; // Default Unsplash images
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Deep purple gradient theme */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto container-padding text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Everything your 
                <span className="text-violet-300"> little one </span>
                needs
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover premium baby products designed with care, crafted for comfort, and built to last.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link to="/category/0-6-months">
                <motion.button
                  className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Shop Now</span>
                  <FiArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section - Enhanced with background images and text highlighting */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4 relative">
              <span className="relative z-10">Shop by Age</span>
              <div className="absolute inset-0 blur-lg opacity-30 bg-gradient-to-r from-deepPurple-400 to-violet-400 rounded-lg"></div>
            </h2>
            <p className="text-xl text-deepPurple-600 max-w-2xl mx-auto font-medium">
              Find the perfect products for every stage of your child's development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/category/${category.id}`}>
                  <motion.div
                    className="relative overflow-hidden modern-card h-80 group cursor-pointer hover:shadow-2xl"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getBackgroundImage(category.id, index)})`,
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-deepPurple-900/90 via-deepPurple-800/60 to-deepPurple-600/40 group-hover:from-deepPurple-900/95 transition-all duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors duration-300">
                          <span className="bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                            {category.displayName}
                          </span>
                        </h3>
                        
                        <p className="text-white/90 leading-relaxed font-medium text-lg group-hover:text-white transition-colors duration-300">
                          {category.description}
                        </p>
                      </div>
                      
                      <motion.div
                        className="flex items-center text-yellow-300 font-bold text-lg mt-6 group-hover:text-yellow-200"
                        whileHover={{ x: 6 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <span className="relative">
                          Explore
                          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></div>
                        </span>
                        <FiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-deepPurple-50">
        <div className="container mx-auto container-padding">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FiStar className="w-6 h-6 text-deepPurple-600" />
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                Featured Products
              </h2>
              <FiStar className="w-6 h-6 text-deepPurple-600" />
            </div>
            <p className="text-xl text-deepPurple-600">
              Carefully selected essentials for modern families
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Deep purple theme */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-deepPurple-100 rounded-full flex items-center justify-center mx-auto">
                <FiTruck className="w-8 h-8 text-deepPurple-600" />
              </div>
              <h3 className="text-xl font-semibold text-deepPurple-900">Fast Shipping</h3>
              <p className="text-deepPurple-600">
                Quick and reliable delivery with express options available
              </p>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-deepPurple-100 rounded-full flex items-center justify-center mx-auto">
                <FiHeart className="w-8 h-8 text-deepPurple-600" />
              </div>
              <h3 className="text-xl font-semibold text-deepPurple-900">Made with Love</h3>
              <p className="text-deepPurple-600">
                Every product is carefully crafted with your little one's comfort in mind
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Deep purple gradient */}
      <section className="section-padding gradient-deep-purple">
        <div className="container mx-auto container-padding text-center">
          <motion.div
            className="max-w-2xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90">
              Get the latest updates on new arrivals and exclusive offers
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-4 focus:ring-white/20 outline-none"
              />
              <motion.button
                className="bg-white text-deepPurple-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 