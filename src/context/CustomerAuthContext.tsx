import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Simulated customer database
const customers: Array<Customer & { password: string; resetCode?: string; resetCodeExpiry?: Date }> = [
  {
    id: '1',
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1987654321',
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date()
  }
];

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
    const savedCustomer = localStorage.getItem('customer');
    if (savedCustomer) {
      try {
        const customer = JSON.parse(savedCustomer);
        setState(prev => ({
          ...prev,
          customer,
          isAuthenticated: true
        }));
      } catch (error) {
        localStorage.removeItem('customer');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
      
      if (!customer) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No account found with this email address'
        }));
        return false;
      }

      if (customer.password !== password) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid password'
        }));
        return false;
      }

      // Update last login
      customer.lastLogin = new Date();

      const customerData: Customer = {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        lastLogin: customer.lastLogin
      };

      setState(prev => ({
        ...prev,
        customer: customerData,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      // Save to localStorage
      localStorage.setItem('customer', JSON.stringify(customerData));

      return true;
    } catch (error) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      const existingCustomer = customers.find(c => c.email.toLowerCase() === customerData.email.toLowerCase());
      if (existingCustomer) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'An account with this email already exists'
        }));
        return false;
      }

      // Create new customer
      const newCustomer = {
        id: Date.now().toString(),
        email: customerData.email,
        password: customerData.password,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        phone: customerData.phone,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      customers.push(newCustomer);

      const customerProfile: Customer = {
        id: newCustomer.id,
        email: newCustomer.email,
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        phone: newCustomer.phone,
        createdAt: newCustomer.createdAt,
        lastLogin: newCustomer.lastLogin
      };

      setState(prev => ({
        ...prev,
        customer: customerProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));

      // Save to localStorage
      localStorage.setItem('customer', JSON.stringify(customerProfile));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
      return false;
    }
  };

  const logout = () => {
    setState(initialState);
    localStorage.removeItem('customer');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
      
      if (!customer) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No account found with this email address'
        }));
        return false;
      }

      // Generate reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const resetCodeExpiry = new Date();
      resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 15); // 15 minutes expiry

      customer.resetCode = resetCode;
      customer.resetCodeExpiry = resetCodeExpiry;

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));

      // In a real app, this would send an email
      console.log(`Password reset code for ${email}: ${resetCode}`);
      alert(`Password reset code sent to ${email}. For demo purposes, the code is: ${resetCode}`);

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send reset code. Please try again.'
      }));
      return false;
    }
  };

  const resetPassword = async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
      
      if (!customer) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No account found with this email address'
        }));
        return false;
      }

      if (!customer.resetCode || customer.resetCode !== resetCode) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid reset code'
        }));
        return false;
      }

      if (!customer.resetCodeExpiry || new Date() > customer.resetCodeExpiry) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Reset code has expired. Please request a new one.'
        }));
        return false;
      }

      // Update password
      customer.password = newPassword;
      customer.resetCode = undefined;
      customer.resetCodeExpiry = undefined;

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }));

      return true;
    } catch (error) {
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const customer = customers.find(c => c.id === state.customer!.id);
      if (!customer) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Customer not found'
        }));
        return false;
      }

      // Update customer data
      Object.assign(customer, customerData);

      const updatedCustomer: Customer = {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        lastLogin: customer.lastLogin
      };

      setState(prev => ({
        ...prev,
        customer: updatedCustomer,
        isLoading: false,
        error: null
      }));

      // Update localStorage
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));

      return true;
    } catch (error) {
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