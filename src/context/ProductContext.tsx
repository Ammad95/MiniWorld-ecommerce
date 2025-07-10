import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/products';

interface ProductState {
  products: Product[];
  isLoading: boolean;
}

interface ProductContextType {
  state: ProductState;
  addProduct: (product: Omit<Product, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProductState>({
    products: [],
    isLoading: true
  });

  // Load products from localStorage or use initial data
  useEffect(() => {
    const storedProducts = localStorage.getItem('miniworld_products');
    
    if (storedProducts) {
      setState({
        products: JSON.parse(storedProducts),
        isLoading: false
      });
    } else {
      // Initialize with default products
      localStorage.setItem('miniworld_products', JSON.stringify(initialProducts));
      setState({
        products: initialProducts,
        isLoading: false
      });
    }
  }, []);

  const saveProducts = (products: Product[]) => {
    localStorage.setItem('miniworld_products', JSON.stringify(products));
    setState(prev => ({ ...prev, products }));
  };

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<{ success: boolean; message: string }> => {
    try {
      const newProduct: Product = {
        ...productData,
        id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const updatedProducts = [...state.products, newProduct];
      saveProducts(updatedProducts);

      return { success: true, message: 'Product added successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to add product' };
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<{ success: boolean; message: string }> => {
    try {
      const updatedProducts = state.products.map(product =>
        product.id === id ? { ...product, ...productData } : product
      );

      saveProducts(updatedProducts);
      return { success: true, message: 'Product updated successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to update product' };
    }
  };

  const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const updatedProducts = state.products.filter(product => product.id !== id);
      saveProducts(updatedProducts);
      return { success: true, message: 'Product deleted successfully!' };
    } catch (error) {
      return { success: false, message: 'Failed to delete product' };
    }
  };

  const getProduct = (id: string): Product | undefined => {
    return state.products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return state.products.filter(product => product.category === category);
  };

  const refreshProducts = () => {
    const storedProducts = localStorage.getItem('miniworld_products');
    if (storedProducts) {
      setState(prev => ({
        ...prev,
        products: JSON.parse(storedProducts)
      }));
    }
  };

  return (
    <ProductContext.Provider value={{
      state,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      getProductsByCategory,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 