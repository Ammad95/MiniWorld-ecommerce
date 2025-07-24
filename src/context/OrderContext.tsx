import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { OrderState, Order, OrderStatus, CartItem, ShippingAddress, PaymentInfo } from '../types';
import EmailService from '../services/EmailService';

interface OrderContextType {
  state: OrderState;
  createOrder: (orderData: { items: CartItem[]; shippingAddress: ShippingAddress; paymentInfo: PaymentInfo; subtotal: number; tax: number; shipping: number; total: number; }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
  addTrackingNumber: (orderId: string, trackingNumber: string) => void;
  cancelOrder: (orderId: string) => void;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'UPDATE_ORDER'; payload: { orderId: string; updates: Partial<Order> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined };

const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        loading: false,
        error: undefined
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status, updatedAt: new Date() }
            : order
        ),
        loading: false,
        error: undefined
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates, updatedAt: new Date() }
            : order
        ),
        loading: false,
        error: undefined
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState: OrderState = {
  orders: [],
  currentOrder: undefined,
  loading: false,
  error: undefined
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const createOrder = async (orderData: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentInfo: PaymentInfo;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }): Promise<Order> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const orderNumber = `MW${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 3);

      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        orderNumber,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        shipping: orderData.shipping,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        paymentInfo: orderData.paymentInfo,
        status: orderData.paymentInfo.method === 'cash_on_delivery' ? 'confirmed' : 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        estimatedDelivery,
        notes: orderData.paymentInfo.method === 'cash_on_delivery' 
          ? 'Cash on Delivery - Payment due upon delivery' 
          : 'Bank Transfer - Awaiting payment confirmation'
      };

      // Send order confirmation email using EmailService instance
      try {
        // Send order confirmation email
        await EmailService.sendOrderConfirmation(newOrder);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      dispatch({ type: 'ADD_ORDER', payload: newOrder });
      return newOrder;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create order' });
      throw error;
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  const getOrder = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  };

  const getUserOrders = (): Order[] => {
    return state.orders;
  };

  const addTrackingNumber = (orderId: string, trackingNumber: string) => {
    dispatch({ 
      type: 'UPDATE_ORDER', 
      payload: { 
        orderId, 
        updates: { 
          trackingNumber,
          status: 'shipped' as OrderStatus
        } 
      } 
    });
  };

  const cancelOrder = (orderId: string) => {
    dispatch({ 
      type: 'UPDATE_ORDER_STATUS', 
      payload: { 
        orderId, 
        status: 'cancelled' 
      } 
    });
  };

  const value: OrderContextType = {
    state,
    createOrder,
    updateOrderStatus,
    getOrder,
    getUserOrders,
    addTrackingNumber,
    cancelOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
