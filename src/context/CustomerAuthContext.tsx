import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
}

interface CustomerAuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface CustomerAuthContextType {
  state: CustomerAuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (customerData: RegisterData) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (email: string, resetCode: string, newPassword: string) => Promise<boolean>;
  updateProfile: (customerData: Partial<Customer>) => Promise<boolean>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

const initialState: CustomerAuthState = {
  customer: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const CustomerAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CustomerAuthState>(initialState);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const customerData = await getCustomerProfile(session.user.id);
          if (customerData) {
            setState(prev => ({
              ...prev,
              customer: customerData,
              isAuthenticated: true
            }));
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const customerData = await getCustomerProfile(session.user.id);
        setState(prev => ({
          ...prev,
          customer: customerData,
          isAuthenticated: !!customerData,
          isLoading: false
        }));
      } else {
        setState({
          customer: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getCustomerProfile = async (userId: string): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching customer profile:', error);
        return null;
      }

      return {
        id: data.id,
        email: data.email,
        firstName: data.name.split(' ')[0] || '',
        lastName: data.name.split(' ').slice(1).join(' ') || '',
        phone: data.mobile,
        createdAt: new Date(data.created_at),
        lastLogin: new Date()
      };
    } catch (error) {
      console.error('Error in getCustomerProfile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        return false;
      }

      if (data.user) {
        const customerData = await getCustomerProfile(data.user.id);
        if (customerData) {
          setState(prev => ({
            ...prev,
            customer: customerData,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }));
          return true;
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load customer profile'
      }));
      return false;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
      return false;
    }
  };

  const register = async (customerData: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: customerData.email.toLowerCase().trim(),
        password: customerData.password,
        options: {
          data: {
            name: `${customerData.firstName} ${customerData.lastName}`,
            mobile: customerData.phone
          }
        }
      });

      if (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        return false;
      }

      if (data.user) {
        // Create customer profile in the customers table
        const { error: profileError } = await supabase
          .from('customers')
          .insert({
            id: data.user.id,
            email: customerData.email.toLowerCase().trim(),
            name: `${customerData.firstName} ${customerData.lastName}`,
            mobile: customerData.phone,
            is_verified: false,
            addresses: []
          });

        if (profileError) {
          console.error('Error creating customer profile:', profileError);
          // Don't fail registration if profile creation fails
        }

        const newCustomer: Customer = {
          id: data.user.id,
          email: customerData.email,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        setState(prev => ({
          ...prev,
          customer: newCustomer,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));

        return true;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
      return false;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setState(initialState);
    } catch (error) {
      console.error('Logout error:', error);
      setState(initialState);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
        redirectTo: `${window.location.origin}/customer/reset-password`
      });

      if (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        return false;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send reset email. Please try again.'
      }));
      return false;
    }
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // For Supabase, we use the session-based password reset
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
        return false;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));
      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to reset password. Please try again.'
      }));
      return false;
    }
  };

  const updateProfile = async (customerData: Partial<Customer>): Promise<boolean> => {
    if (!state.customer) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updateData: any = {};
      
      if (customerData.firstName || customerData.lastName) {
        const firstName = customerData.firstName || state.customer.firstName;
        const lastName = customerData.lastName || state.customer.lastName;
        updateData.name = `${firstName} ${lastName}`;
      }
      
      if (customerData.phone !== undefined) {
        updateData.mobile = customerData.phone;
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', state.customer.id);

        if (error) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error.message
          }));
          return false;
        }
      }

      const updatedCustomer = {
        ...state.customer,
        ...customerData
      };

      setState(prev => ({
        ...prev,
        customer: updatedCustomer,
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile. Please try again.'
      }));
      return false;
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: CustomerAuthContextType = {
    state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    clearError,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = (): CustomerAuthContextType => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}; 