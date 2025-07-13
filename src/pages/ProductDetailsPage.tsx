import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShoppingCart, FiCheck, FiMinus, FiPlus } from 'react-icons/fi';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useCart } from '../context/CartContext';
import { useSupabaseProducts } from '../context/SupabaseProductContext';
import { Product } from '../types';

interface ProductDetailsPageProps {}

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const { getProduct, state: productState } = useSupabaseProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const fetchedProduct = getProduct(productId);
        setProduct(fetchedProduct || null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId, getProduct]);

  const relatedProducts = product 
    ? productState.products.filter(p => p.category === product.category && p.id !== productId).slice(0, 4)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">
            Loading Product...
          </h1>
          <p className="text-navy-600 mb-8">Please wait while we fetch the product details.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-navy-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-navy-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const result = addItem(product, quantity);
    if (result.success) {
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 3000);
    }
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-orange-400 fill-current' : 'text-navy-300'}`}
      />
    ));
  };

  const galleryImages = product.images.map(image => ({
    original: image,
    thumbnail: image,
  }));
  
  // Set initial slide to thumbnail index
  const initialSlideIndex = product.thumbnailIndex || 0;

  return (
    <div className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center space-x-2 text-navy-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-orange-600 transition-colors">
            {product.category.replace('-', ' ').toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-navy-900 font-medium">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-6 border border-navy-200 shadow-soft">
              <ImageGallery
                items={galleryImages}
                showThumbnails={true}
                showFullscreenButton={true}
                showPlayButton={false}
                showNav={true}
                onSlide={setSelectedImageIndex}
                thumbnailPosition="bottom"
                startIndex={initialSlideIndex}
                renderItem={(item) => (
                  <div className="relative h-96 flex items-center justify-center">
                    <img
                      src={item.original}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                )}
              />
            </div>

            {/* Product Badges */}
            <div className="flex flex-wrap gap-3">
              {product.isNew && (
                <span className="px-3 py-1 bg-gradient-to-r from-navy-500 to-navy-600 text-white text-sm font-bold rounded-full">
                  NEW ARRIVAL
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-full">
                  ON SALE
                </span>
              )}
              <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-sm font-bold rounded-full">
                PREMIUM QUALITY
              </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-navy-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-navy-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-navy-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-navy-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">Description</h3>
              <p className="text-navy-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FiCheck className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-navy-700 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div>
                  <label className="block text-navy-900 font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-2 bg-navy-50 rounded-lg p-2 border border-navy-200">
                    <motion.button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 text-navy-600 hover:text-orange-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={quantity <= 1}
                    >
                      <FiMinus className="w-4 h-4" />
                    </motion.button>
                    
                    <span className="w-16 text-center text-navy-900 font-medium text-lg">
                      {quantity}
                    </span>
                    
                    <motion.button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 text-navy-600 hover:text-orange-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiPlus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-navy-900 font-medium mb-2">Total</div>
                  <div className="text-2xl font-bold text-orange-600">
                    Rs. {(product.price * quantity).toLocaleString('en-PK')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!product.inStock}
                >
                  {isAddedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <FiCheck className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                    </motion.div>
                  )}
                </motion.button>

                <motion.button
                  className="px-6 py-4 border-2 border-orange-400 text-orange-600 font-semibold rounded-lg hover:bg-orange-400 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiHeart className="w-5 h-5" />
                  <span>Add to Wishlist</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Related Products
              </h2>
              <p className="text-navy-600">
                You might also like these products
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Assuming ProductCard is defined elsewhere or will be added */}
                  {/* <ProductCard product={relatedProduct} /> */}
                  <div className="bg-white rounded-2xl p-6 border border-navy-200 shadow-soft">
                    <h3 className="text-xl font-bold text-navy-900 mb-2">{relatedProduct.name}</h3>
                    <p className="text-navy-600 text-sm">{relatedProduct.description}</p>
                    <div className="flex items-center space-x-2 mt-4">
                      <span className="text-navy-900 font-bold">${relatedProduct.price.toFixed(2)}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-navy-500 text-sm line-through">${relatedProduct.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage; 