import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiArrowLeft, 
  FiSearch, 
  FiEdit3, 
  FiTrendingUp, 
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiPlus,
  FiMinus,
  FiSave
} from 'react-icons/fi';
import { useSupabaseProducts } from '../../context/SupabaseProductContext';
import { categories } from '../../data/categories';

const InventoryManagement: React.FC = () => {
  const { state: productState, updateProduct } = useSupabaseProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [editingStock, setEditingStock] = useState<{ [key: string]: number }>({});
  const [updateQueue, setUpdateQueue] = useState<{ [key: string]: number }>({});

  const filteredProducts = productState.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStock = stockFilter === 'all' || product.stockStatus === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.displayName : category;
  };

  const getStockStatusConfig = (status: string) => {
    switch (status) {
      case 'in_stock':
        return { 
          color: 'text-green-600', 
          bgColor: 'bg-green-100', 
          icon: FiCheck, 
          label: 'In Stock' 
        };
      case 'low_stock':
        return { 
          color: 'text-yellow-600', 
          bgColor: 'bg-yellow-100', 
          icon: FiAlertTriangle, 
          label: 'Low Stock' 
        };
      case 'out_of_stock':
        return { 
          color: 'text-red-600', 
          bgColor: 'bg-red-100', 
          icon: FiX, 
          label: 'Out of Stock' 
        };
      default:
        return { 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-100', 
          icon: FiPackage, 
          label: 'Unknown' 
        };
    }
  };

  const handleStockEdit = (productId: string, currentStock: number) => {
    setEditingStock(prev => ({ ...prev, [productId]: currentStock }));
  };

  const handleStockUpdate = async (productId: string) => {
    const newStock = editingStock[productId];
    if (newStock === undefined) return;

    try {
      const product = productState.products.find(p => p.id === productId);
      if (!product) return;

      // Determine new stock status
      let newStockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
      if (newStock === 0) {
        newStockStatus = 'out_of_stock';
      } else if (newStock <= (product.lowStockThreshold || 5)) {
        newStockStatus = 'low_stock';
      } else {
        newStockStatus = 'in_stock';
      }

      await updateProduct(productId, {
        stockQuantity: newStock,
        stockStatus: newStockStatus,
        inStock: newStock > 0
      });

      // Remove from editing state
      setEditingStock(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });

      // Add to update queue for visual feedback
      setUpdateQueue(prev => ({ ...prev, [productId]: newStock }));
      setTimeout(() => {
        setUpdateQueue(prev => {
          const newState = { ...prev };
          delete newState[productId];
          return newState;
        });
      }, 2000);

    } catch (error) {
      console.error('Failed to update stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  const handleStockCancel = (productId: string) => {
    setEditingStock(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const adjustStock = (productId: string, adjustment: number) => {
    const currentEditing = editingStock[productId];
    const currentStock = productState.products.find(p => p.id === productId)?.stockQuantity || 0;
    const newValue = Math.max(0, (currentEditing !== undefined ? currentEditing : currentStock) + adjustment);
    setEditingStock(prev => ({ ...prev, [productId]: newValue }));
  };

  const stockCounts = {
    all: productState.products.length,
    in_stock: productState.products.filter(p => p.stockStatus === 'in_stock').length,
    low_stock: productState.products.filter(p => p.stockStatus === 'low_stock').length,
    out_of_stock: productState.products.filter(p => p.stockStatus === 'out_of_stock').length,
  };

  const totalStockValue = productState.products.reduce((sum, product) => 
    sum + (product.stockQuantity * product.price), 0
  );

  const lowStockAlerts = productState.products.filter(p => p.stockStatus === 'low_stock' || p.stockStatus === 'out_of_stock').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto container-padding py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-deepPurple-600 hover:text-deepPurple-800">
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Monitor and manage product stock levels</p>
              </div>
            </div>
            
            {lowStockAlerts > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    {lowStockAlerts} product{lowStockAlerts > 1 ? 's' : ''} need restocking
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto container-padding py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stockCounts.all}</p>
              </div>
              <FiPackage className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{stockCounts.in_stock}</p>
              </div>
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{stockCounts.low_stock}</p>
              </div>
              <FiAlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{stockCounts.out_of_stock}</p>
              </div>
              <FiX className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>
        </div>

        {/* Total Stock Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-deepPurple-600 to-deepPurple-700 text-white p-6 rounded-lg shadow-lg mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-deepPurple-100">Total Inventory Value</p>
              <p className="text-3xl font-bold">PKR {totalStockValue.toLocaleString('en-PK')}</p>
            </div>
            <FiTrendingUp className="w-12 h-12 text-deepPurple-200" />
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
            
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

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="form-input"
            >
              <option value="all">All Stock Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredProducts.length} of {stockCounts.all} products
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Current Stock</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Low Stock Alert</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Max Capacity</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Stock Value</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const statusConfig = getStockStatusConfig(product.stockStatus);
                  const StatusIcon = statusConfig.icon;
                  const isEditing = editingStock[product.id] !== undefined;
                  const isUpdated = updateQueue[product.id] !== undefined;
                  
                  return (
                    <motion.tr 
                      key={product.id} 
                      className={`hover:bg-gray-50 ${isUpdated ? 'bg-green-50' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
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
                            <div className="text-sm text-gray-500">PKR {product.price.toLocaleString('en-PK')}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-gray-900">
                        {getCategoryName(product.category)}
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => adjustStock(product.id, -1)}
                              className="p-1 text-gray-600 hover:text-red-600 rounded"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={editingStock[product.id]}
                              onChange={(e) => setEditingStock(prev => ({ 
                                ...prev, 
                                [product.id]: parseInt(e.target.value) || 0 
                              }))}
                              className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                            />
                            <button
                              onClick={() => adjustStock(product.id, 1)}
                              className="p-1 text-gray-600 hover:text-green-600 rounded"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-lg font-semibold ${
                            product.stockQuantity === 0 ? 'text-red-600' : 
                            product.stockQuantity <= (product.lowStockThreshold || 5) ? 'text-yellow-600' : 
                            'text-gray-900'
                          }`}>
                            {product.stockQuantity}
                          </span>
                        )}
                      </td>
                      
                      <td className="py-4 px-6 text-center text-gray-600">
                        {product.lowStockThreshold || 5}
                      </td>
                      
                      <td className="py-4 px-6 text-center text-gray-600">
                        {product.maxStockQuantity || 'N/A'}
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {statusConfig.label}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6 text-center font-medium text-gray-900">
                        PKR {(product.stockQuantity * product.price).toLocaleString('en-PK')}
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleStockUpdate(product.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Save changes"
                            >
                              <FiSave className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStockCancel(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Cancel changes"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStockEdit(product.id, product.stockQuantity)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit stock"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement; 
