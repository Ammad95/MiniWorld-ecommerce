import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OrderState, Order, OrderStatus, CartItem, ShippingAddress, PaymentInfo } from '../types';
import EmailService from '../services/EmailService';

interface OrderContextType {
  state: OrderState;
  createOrder: (items: CartItem[], shippingAddress: ShippingAddress, paymentInfo: PaymentInfo) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
  addTrackingNumber: (orderId: string, trackingNumber: string) => void;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | undefined }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined };

const initialState: OrderState = {
  orders: [],
  currentOrder: undefined,
  loading: false,
  error: undefined,
};

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
        currentOrder: action.payload,
        error: undefined,
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        ),
        error: undefined,
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates, updatedAt: new Date() }
            : order
        ),
        error: undefined,
      };
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Helper function to calculate order totals
const calculateOrderTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  return { subtotal, tax, shipping, total };
};

// Helper function to generate order number
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MW${timestamp.slice(-6)}${random}`;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const createOrder = async (
    items: CartItem[], 
    shippingAddress: ShippingAddress, 
    paymentInfo: PaymentInfo
  ): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { subtotal, tax, shipping, total } = calculateOrderTotals(items);
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7); // 7 days from now
      
      const newOrder: Order = {
        id: Date.now().toString(),
        orderNumber: generateOrderNumber(),
        items,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        paymentInfo,
        status: paymentInfo.method === 'cash_on_delivery' ? 'confirmed' : 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery,
      };
      
      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      
      // Send order confirmation email
      try {
        await EmailService.sendOrderConfirmation(newOrder);
      } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        // Don't fail the order creation if email fails
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return newOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create order' });
      throw error;
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const currentOrder = state.orders.find(order => order.id === orderId);
    const oldStatus = currentOrder?.status;
    
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    
    // Send status update email if status changed
    if (currentOrder && oldStatus && oldStatus !== status) {
      EmailService.sendStatusUpdate(currentOrder, oldStatus, status).catch(error => {
        console.error('Failed to send status update email:', error);
      });
    }
  };

  const getOrder = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  };

  const getUserOrders = (): Order[] => {
    return state.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const addTrackingNumber = (orderId: string, trackingNumber: string) => {
    const currentOrder = state.orders.find(order => order.id === orderId);
    const oldStatus = currentOrder?.status;
    
    dispatch({ 
      type: 'UPDATE_ORDER', 
      payload: { 
        orderId, 
        updates: { trackingNumber, status: 'shipped' as OrderStatus } 
      } 
    });
    
    // Send shipping notification email
    if (currentOrder && oldStatus && oldStatus !== 'shipped') {
      const updatedOrder = { ...currentOrder, trackingNumber, status: 'shipped' as OrderStatus };
      EmailService.sendStatusUpdate(updatedOrder, oldStatus, 'shipped').catch(error => {
        console.error('Failed to send shipping notification email:', error);
      });
    }
  };

  const cancelOrder = (orderId: string) => {
    const order = getOrder(orderId);
    if (order && ['pending', 'confirmed'].includes(order.status)) {
      const oldStatus = order.status;
      dispatch({ 
        type: 'UPDATE_ORDER_STATUS', 
        payload: { orderId, status: 'cancelled' } 
      });
      
      // Send cancellation email
      EmailService.sendStatusUpdate(order, oldStatus, 'cancelled').catch(error => {
        console.error('Failed to send cancellation email:', error);
      });
    }
  };

  const value: OrderContextType = {
    state,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders,
    addTrackingNumber,
    cancelOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}; 