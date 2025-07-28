import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderStatus, CartItem, ShippingAddress, PaymentInfo } from '../types';
import EmailService from '../services/EmailService';

interface OrderState {
  orders: Order[];
  currentOrder?: Order;
  isLoading: boolean;
  error: string | null;
}

interface OrderContextType {
  state: OrderState;
  createOrder: (orderData: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentInfo: PaymentInfo;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  fetchOrders: () => Promise<void>;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useSupabaseOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useSupabaseOrder must be used within SupabaseOrderProvider');
  }
  return context;
};

export const SupabaseOrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<OrderState>({
    orders: [],
    currentOrder: undefined,
    isLoading: false,
    error: null
  });

  // Convert Supabase order to app format
  const formatOrderFromDB = (dbOrder: any): Order => {
    // Convert database order_items to CartItem format
    const cartItems = (dbOrder.order_items || []).map((dbItem: any) => ({
      id: dbItem.id || Math.random().toString(),
      product: {
        id: dbItem.product_id || 'unknown',
        name: dbItem.product_name || 'Unknown Product',
        price: Number(dbItem.unit_price || 0),
        images: [], // No images stored in order items
        description: '',
        category: '',
        isActive: true
      },
      quantity: Number(dbItem.quantity || 1)
    }));

    return {
      id: dbOrder.id,
      orderNumber: dbOrder.order_number || `MW${dbOrder.id.slice(-6)}`,
      items: cartItems,
      subtotal: Number(dbOrder.subtotal || 0),
      tax: Number(dbOrder.tax || 0),
      shipping: Number(dbOrder.shipping || 0),
      total: Number(dbOrder.total_amount),
      shippingAddress: {
        fullName: dbOrder.customer_name,
        email: dbOrder.customer_email,
        phone: dbOrder.customer_phone || '',
        address: dbOrder.customer_address || '',
        city: dbOrder.customer_city || '',
        zipCode: dbOrder.customer_postal_code || '',
        state: dbOrder.customer_state || '',
        country: 'Pakistan'
      },
      paymentInfo: {
        method: dbOrder.payment_method as 'cash_on_delivery' | 'bank_transfer',
        selectedAccount: dbOrder.payment_details ? JSON.parse(dbOrder.payment_details) : undefined
      },
      status: dbOrder.status as OrderStatus,
      createdAt: new Date(dbOrder.created_at),
      updatedAt: new Date(dbOrder.updated_at),
      estimatedDelivery: dbOrder.estimated_delivery ? new Date(dbOrder.estimated_delivery) : undefined,
      notes: dbOrder.notes || '',
      trackingNumber: dbOrder.tracking_number
    };
  };

  // Convert app order to Supabase format
  const formatOrderForDB = (order: Order) => {
    return {
      id: order.id,
      order_number: order.orderNumber,
      customer_name: order.shippingAddress.fullName,
      customer_email: order.shippingAddress.email,
      customer_phone: order.shippingAddress.phone,
      customer_address: order.shippingAddress.address,
      customer_city: order.shippingAddress.city,
      customer_postal_code: order.shippingAddress.zipCode,
      customer_state: order.shippingAddress.state,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total_amount: order.total,
      payment_method: order.paymentInfo.method,
      payment_details: order.paymentInfo.selectedAccount ? JSON.stringify(order.paymentInfo.selectedAccount) : null,
      status: order.status,
      estimated_delivery: order.estimatedDelivery?.toISOString(),
      notes: order.notes,
      tracking_number: order.trackingNumber || null,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString()
    };
  };

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      console.log('🔍 Starting to fetch orders from Supabase...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false });

      console.log('📊 Supabase response:', { orders, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log(`📦 Found ${orders?.length || 0} orders in database`);

      // Convert to app format
      const formattedOrders = (orders || []).map(formatOrderFromDB);
      console.log('✅ Formatted orders:', formattedOrders);

      setState(prev => ({
        ...prev,
        orders: formattedOrders,
        isLoading: false,
        error: null
      }));
    } catch (error: any) {
      console.error('💥 Error fetching orders:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch orders'
      }));
    }
  };

  // Create new order
  const createOrder = async (orderData: {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    paymentInfo: PaymentInfo;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }): Promise<Order> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const orderNumber = `MW${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 3);

      const newOrder: Order = {
        id: orderId,
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

      // Save order to Supabase
      const dbOrder = formatOrderForDB(newOrder);
      const { error: orderError } = await supabase
        .from('orders')
        .insert([dbOrder])
        .select()
        .single();

      if (orderError) {
        throw new Error(`Failed to save order: ${orderError.message}`);
      }

      // Save order items
      const orderItems = orderData.items.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Failed to save order items:', itemsError);
        // Don't throw error here, order is already saved
      }

      // Send order confirmation email
      try {
        await EmailService.sendOrderConfirmation(newOrder);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't throw error, order is saved
      }

      // Update local state
      setState(prev => ({
        ...prev,
        orders: [newOrder, ...prev.orders],
        currentOrder: newOrder,
        isLoading: false,
        error: null
      }));

      return newOrder;
    } catch (error: any) {
      console.error('Error creating order:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create order'
      }));
      throw error;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date() }
            : order
        )
      }));

      return true;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to update order status'
      }));
      return false;
    }
  };

  // Get specific order
  const getOrder = (orderId: string): Order | undefined => {
    return state.orders.find(order => order.id === orderId);
  };

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      console.log('🔗 Testing database connection...');
      
      // Simple query to check if orders table exists
      const { data, error, count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      console.log('🏗️ Orders table test:', { data, error, count });
      
      if (error) {
        console.error('❌ Orders table error:', error.message);
        if (error.message.includes('relation "public.orders" does not exist')) {
          console.error('🚨 ORDERS TABLE DOES NOT EXIST! You need to run the SQL script.');
        }
      } else {
        console.log(`✅ Orders table exists with ${count} records`);
      }
    } catch (err) {
      console.error('💥 Database connection test failed:', err);
    }
  };

  // Load orders on mount
  useEffect(() => {
    testDatabaseConnection();
    fetchOrders();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('orders_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Order changed:', payload);
          fetchOrders(); // Refresh orders when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value: OrderContextType = {
    state,
    createOrder,
    updateOrderStatus,
    fetchOrders,
    getOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default SupabaseOrderProvider; 