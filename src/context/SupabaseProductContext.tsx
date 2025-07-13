import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase, supabaseHelpers } from '../lib/supabase';
import { products as initialProducts } from '../data/products';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

interface ProductContextType {
  state: ProductState;
  addProduct: (product: Omit<Product, 'id'>) => Promise<{ success: boolean; message: string }>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; message: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  refreshProducts: () => void;
  migrateLocalData: () => Promise<{ success: boolean; message: string }>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const SupabaseProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProductState>({
    products: [],
    isLoading: true,
    error: null
  });

  // Load products from Supabase
  const loadProducts = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Convert database format to app format
      const products = (data || []).map(supabaseHelpers.formatProduct);

      setState({
        products,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error loading products:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load products'
      }));
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product changed:', payload);
          loadProducts(); // Refresh products when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<{ success: boolean; message: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const dbProduct = supabaseHelpers.formatProductForDB(productData);

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Add to local state
      const newProduct = supabaseHelpers.formatProduct(data);
      setState(prev => ({
        ...prev,
        products: [...prev.products, newProduct],
        isLoading: false
      }));

      return { success: true, message: 'Product added successfully!' };
    } catch (error: any) {
      console.error('Error adding product:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: error.message || 'Failed to add product' };
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<{ success: boolean; message: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const dbProduct = supabaseHelpers.formatProductForDB(productData);

      const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      const updatedProduct = supabaseHelpers.formatProduct(data);
      setState(prev => ({
        ...prev,
        products: prev.products.map(product =>
          product.id === id ? { ...product, ...updatedProduct } : product
        ),
        isLoading: false
      }));

      return { success: true, message: 'Product updated successfully!' };
    } catch (error: any) {
      console.error('Error updating product:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: error.message || 'Failed to update product' };
    }
  };

  const deleteProduct = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from local state
      setState(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== id),
        isLoading: false
      }));

      return { success: true, message: 'Product deleted successfully!' };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: error.message || 'Failed to delete product' };
    }
  };

  const getProduct = (id: string): Product | undefined => {
    return state.products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return state.products.filter(product => product.category === category);
  };

  const refreshProducts = () => {
    loadProducts();
  };

  // Migration function to move localStorage data to Supabase
  const migrateLocalData = async (): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if we have data in localStorage
      const storedProducts = localStorage.getItem('miniworld_products');
      let productsToMigrate: Product[] = [];

      if (storedProducts) {
        productsToMigrate = JSON.parse(storedProducts);
      } else {
        // Use initial products if no localStorage data
        productsToMigrate = initialProducts;
      }

      if (productsToMigrate.length === 0) {
        return { success: false, message: 'No products found to migrate' };
      }

      // Check if products already exist in Supabase
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id, name');

      if (existingProducts && existingProducts.length > 0) {
        return { success: false, message: 'Products already exist in database. Migration not needed.' };
      }

      // Convert products to database format and insert
      const dbProducts = productsToMigrate.map(product => {
        const dbProduct = supabaseHelpers.formatProductForDB(product);
        // Remove the id field for insert
        return dbProduct;
      });

      const { data, error } = await supabase
        .from('products')
        .insert(dbProducts)
        .select();

      if (error) {
        throw error;
      }

      // Refresh products after migration
      await loadProducts();

      // Clear localStorage after successful migration
      localStorage.removeItem('miniworld_products');

      return { 
        success: true, 
        message: `Successfully migrated ${data?.length || 0} products to database!` 
      };
    } catch (error: any) {
      console.error('Error migrating products:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to migrate products' 
      };
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
      refreshProducts,
      migrateLocalData
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useSupabaseProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useSupabaseProducts must be used within a SupabaseProductProvider');
  }
  return context;
}; 