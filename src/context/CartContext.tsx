import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartState, CartItem, Product } from '../types';

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity: number) => { success: boolean; message?: string };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        
        // Check against stock quantity
        if (newQuantity > product.stockQuantity) {
          return state; // Don't update if exceeds stock
        }
        
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Check if initial quantity exceeds stock
        if (quantity > product.stockQuantity) {
          return state; // Don't add if exceeds stock
        }
        newItems = [...state.items, { product, quantity }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
      }
      
      // Find the product to check stock
      const item = state.items.find(item => item.product.id === id);
      if (item && quantity > item.product.stockQuantity) {
        return state; // Don't update if exceeds stock
      }
      
      const newItems = state.items.map(item =>
        item.product.id === id ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { items: newItems, total, itemCount };
    }
    
    case 'CLEAR_CART':
      return initialState;
      
    case 'LOAD_CART':
      return action.payload;
      
    default:
      return state;
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('miniworld-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('miniworld-cart', JSON.stringify(state));
  }, [state]);

  const addItem = (product: Product, quantity: number): { success: boolean; message?: string } => {
    // Check if product is out of stock
    if (product.stockQuantity === 0) {
      return { success: false, message: 'This product is out of stock' };
    }
    
    const existingItem = state.items.find(item => item.product.id === product.id);
    const currentQuantityInCart = existingItem?.quantity || 0;
    const newTotalQuantity = currentQuantityInCart + quantity;
    
    if (newTotalQuantity > product.stockQuantity) {
      const remainingStock = product.stockQuantity - currentQuantityInCart;
      return { 
        success: false, 
        message: `Only ${remainingStock} item(s) available in stock` 
      };
    }
    
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    
    // Check if state actually changed (reducer validation)
    return { success: true };
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number): { success: boolean; message?: string } => {
    const item = state.items.find(item => item.product.id === id);
    
    if (!item) {
      return { success: false, message: 'Item not found in cart' };
    }
    
    if (quantity > item.product.stockQuantity) {
      return { 
        success: false, 
        message: `Only ${item.product.stockQuantity} item(s) available in stock` 
      };
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    return { success: true };
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 