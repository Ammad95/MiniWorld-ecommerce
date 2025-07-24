import React, { useState } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiPackage } from 'react-icons/fi';
import { useSupabaseProducts } from '../../context/SupabaseProductContext';
import { categories } from '../../data/categories';
import ProductModal from '../../components/admin/ProductModal';

const ProductManagement: React.FC = () => {
  const { state: productState, deleteProduct } = useSupabaseProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const filteredProducts = productState.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (window.confirm(`Delete "${productName}"?`)) {
      await deleteProduct(productId);
    }
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.displayName : category;
  };

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString('en-PK')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your products ({filteredProducts.length} total)</p>
          </div>
          <button 
            onClick={() => {
              setEditingProductId(null);
              setShowModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="modern-card p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input flex-1 max-w-md"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {productState.isLoading ? (
          <div className="modern-card p-12 text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="modern-card p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new product</p>
          </div>
        ) : (
          <div className="modern-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Product</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Price</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900">Stock</th>
                    <th className="text-right py-3 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                              src={product.images[product.thumbnailIndex || 0] || product.images[0]} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {getCategoryName(product.category)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-900 font-medium">{formatPrice(product.price)}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setEditingProductId(product.id);
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={editingProductId ? productState.products.find(p => p.id === editingProductId) : undefined}
        onSave={() => {
          setShowModal(false);
          setEditingProductId(null);
        }}
      />
    </div>
  );
};

export default ProductManagement; 
