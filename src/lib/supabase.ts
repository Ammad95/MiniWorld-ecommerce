import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'your-supabase-url') {
  throw new Error('VITE_SUPABASE_URL is not configured. Please set this environment variable in your Netlify dashboard.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  throw new Error('VITE_SUPABASE_ANON_KEY is not configured. Please set this environment variable in your Netlify dashboard.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          original_price?: number;
          category: string;
          description?: string;
          features: any[];
          images: any[];
          in_stock: boolean;
          stock_quantity: number;
          low_stock_threshold: number;
          max_stock_quantity: number;
          stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
          rating: number;
          reviews: number;
          is_new: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          original_price?: number;
          category: string;
          description?: string;
          features?: any[];
          images?: any[];
          in_stock?: boolean;
          stock_quantity?: number;
          low_stock_threshold?: number;
          max_stock_quantity?: number;
          stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
          rating?: number;
          reviews?: number;
          is_new?: boolean;
          is_featured?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          original_price?: number;
          category?: string;
          description?: string;
          features?: any[];
          images?: any[];
          in_stock?: boolean;
          stock_quantity?: number;
          low_stock_threshold?: number;
          max_stock_quantity?: number;
          stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock';
          rating?: number;
          reviews?: number;
          is_new?: boolean;
          is_featured?: boolean;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          image_url?: string;
          banner_image?: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          name: string;
          mobile?: string;
          date_of_birth?: string;
          addresses: any[];
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string;
          mobile?: string;
          role: 'super_admin' | 'admin';
          is_first_login: boolean;
          is_active: boolean;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id?: string;
          customer_email?: string;
          customer_name?: string;
          items: any[];
          subtotal: number;
          tax: number;
          shipping: number;
          total: number;
          shipping_address: any;
          payment_info: any;
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number?: string;
          estimated_delivery?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
      };
      payment_accounts: {
        Row: {
          id: string;
          account_title: string;
          account_number: string;
          bank: string;
          iban?: string;
          payment_method_type: 'bank_transfer' | 'mobile_wallet' | 'credit_card';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Check if user is admin
  isAdmin: async (email: string) => {
    const { data } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();
    
    return !!data;
  },

  // Format database product to app format
  formatProduct: (dbProduct: any) => ({
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    category: dbProduct.category,
    description: dbProduct.description,
    features: dbProduct.features || [],
    images: dbProduct.images || [],
    inStock: dbProduct.in_stock,
    stockQuantity: dbProduct.stock_quantity,
    lowStockThreshold: dbProduct.low_stock_threshold,
    maxStockQuantity: dbProduct.max_stock_quantity,
    stockStatus: dbProduct.stock_status,
    rating: dbProduct.rating,
    reviews: dbProduct.reviews,
    isNew: dbProduct.is_new,
    isFeatured: dbProduct.is_featured,
  }),

  // Format app product to database format
  formatProductForDB: (appProduct: any) => ({
    name: appProduct.name,
    price: appProduct.price,
    original_price: appProduct.originalPrice,
    category: appProduct.category,
    description: appProduct.description,
    features: appProduct.features || [],
    images: appProduct.images || [],
    in_stock: appProduct.inStock,
    stock_quantity: appProduct.stockQuantity,
    low_stock_threshold: appProduct.lowStockThreshold,
    max_stock_quantity: appProduct.maxStockQuantity,
    rating: appProduct.rating || 0,
    reviews: appProduct.reviews || 0,
    is_new: appProduct.isNew || false,
    is_featured: appProduct.isFeatured || false,
  }),
}; 