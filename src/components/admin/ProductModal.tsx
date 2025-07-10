import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiUpload, FiTrash2, FiStar, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { useProducts } from '../../context/ProductContext';
import { categories } from '../../data/categories';
import { AgeCategory } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string | null;
}

interface PhotoData {
  file?: File;
  url: string;
  isUploaded: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, productId }) => {
  const { getProduct, addProduct, updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '' as AgeCategory | '',
    description: '',
    features: [''],
    inStock: true,
    rating: '4.5',
    reviews: '0',
    isNew: false,
    isFeatured: false,
    // Inventory fields
    stockQuantity: '50',
    lowStockThreshold: '10',
    maxStockQuantity: '100'
  });

  useEffect(() => {
    if (productId && isOpen) {
      const product = getProduct(productId);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          category: product.category,
          description: product.description,
          features: product.features.length > 0 ? product.features : [''],
          inStock: product.inStock,
          rating: product.rating.toString(),
          reviews: product.reviews.toString(),
          isNew: product.isNew || false,
          isFeatured: product.isFeatured || false,
          // Inventory fields
          stockQuantity: product.stockQuantity?.toString() || '50',
          lowStockThreshold: product.lowStockThreshold?.toString() || '10',
          maxStockQuantity: product.maxStockQuantity?.toString() || '100'
        });
        
        // Convert existing images to PhotoData format
        const existingPhotos: PhotoData[] = product.images.map(url => ({
          url,
          isUploaded: true
        }));
        setPhotos(existingPhotos);
        setThumbnailIndex(product.thumbnailIndex || 0);
      }
    } else if (!productId && isOpen) {
      setFormData({
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        description: '',
        features: [''],
        inStock: true,
        rating: '4.5',
        reviews: '0',
        isNew: false,
        isFeatured: false,
        // Inventory fields
        stockQuantity: '50',
        lowStockThreshold: '10',
        maxStockQuantity: '100'
      });
      setPhotos([]);
      setThumbnailIndex(0);
    }
  }, [productId, isOpen, getProduct]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setPhotos(prev => [...prev, {
            file,
            url,
            isUploaded: false
          }]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Adjust thumbnail index if necessary
    if (thumbnailIndex >= index) {
      setThumbnailIndex(Math.max(0, thumbnailIndex - 1));
    }
  };

  const setAsThumbnail = (index: number) => {
    setThumbnailIndex(index);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert new files to base64 for storage
      const processedImages: string[] = [];
      for (const photo of photos) {
        if (photo.isUploaded) {
          processedImages.push(photo.url);
        } else if (photo.file) {
          const base64 = await convertFileToBase64(photo.file);
          processedImages.push(base64);
        }
      }

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        category: formData.category as AgeCategory,
        description: formData.description,
        features: formData.features.filter(f => f.trim()),
        images: processedImages,
        thumbnailIndex: processedImages.length > 0 ? thumbnailIndex : undefined,
        inStock: Number(formData.stockQuantity) > 0,
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        // Inventory fields
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        maxStockQuantity: Number(formData.maxStockQuantity),
        stockStatus: (() => {
          const stock = Number(formData.stockQuantity);
          const lowThreshold = Number(formData.lowStockThreshold);
          if (stock === 0) return 'out_of_stock' as const;
          if (stock <= lowThreshold) return 'low_stock' as const;
          return 'in_stock' as const;
        })()
      };

      if (productId) {
        await updateProduct(productId, productData);
      } else {
        await addProduct(productData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {productId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Photos Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Photos (Up to 5 photos)
            </label>
            
            {/* Photo Grid */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`relative aspect-square border-2 rounded-lg overflow-hidden group ${
                    thumbnailIndex === index ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Thumbnail indicator */}
                  {thumbnailIndex === index && (
                    <div className="absolute top-1 left-1 bg-pink-500 text-white p-1 rounded">
                      <FiStar className="w-3 h-3" />
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setAsThumbnail(index)}
                      className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100"
                      title="Set as thumbnail"
                    >
                      <FiStar className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="p-1 bg-white rounded text-red-600 hover:bg-red-50"
                      title="Remove photo"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Upload slot */}
              {photos.length < 5 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-colors"
                >
                  <FiUpload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 text-center">Upload Photo</span>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <p className="text-sm text-gray-500">
              Upload up to 5 photos. Click the star icon to set a photo as thumbnail.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="form-input"
                    placeholder="25000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter price in Pakistani Rupees</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price (PKR)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="form-input"
                    placeholder="30000"
                  />
                  <p className="text-xs text-gray-500 mt-1">For sale items (optional)</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as AgeCategory }))}
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData(prev => ({ ...prev, reviews: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input h-32"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  value={formData.features.join('\n')}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value.split('\n') }))}
                  className="form-input h-32"
                  placeholder="Enter features, one per line"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as New</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
              </div>
            </div>
          </div>

          {/* Inventory Management Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  className="form-input"
                  placeholder="50"
                />
                <p className="text-xs text-gray-500 mt-1">Current available stock</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Alert
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                  className="form-input"
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">Alert when stock reaches this level</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.maxStockQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStockQuantity: e.target.value }))}
                  className="form-input"
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum stock capacity (optional)</p>
              </div>
            </div>

            {/* Stock Status Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Stock Status Preview:</span>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const stock = Number(formData.stockQuantity);
                    const lowThreshold = Number(formData.lowStockThreshold);
                    if (stock === 0) {
                      return (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-600">
                          <FiX className="w-4 h-4 mr-1" />
                          Out of Stock
                        </span>
                      );
                    } else if (stock <= lowThreshold) {
                      return (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-600">
                          <FiAlertTriangle className="w-4 h-4 mr-1" />
                          Low Stock
                        </span>
                      );
                    } else {
                      return (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600">
                          <FiCheck className="w-4 h-4 mr-1" />
                          In Stock
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 px-6 py-2"
            >
              {isSubmitting ? 'Saving...' : (productId ? 'Update' : 'Add')} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal; 