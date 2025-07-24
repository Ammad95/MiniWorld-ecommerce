import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PaymentAccountDetails, PaymentState } from '../types';

// Mock data for payment accounts
const mockPaymentAccounts: PaymentAccountDetails[] = [
  // Bank Transfer Account
  {
    id: '1',
    accountName: 'MiniHub Business Account',
    accountNumber: '1234567890123456',
    bankName: 'Allied Bank Limited',
    paymentMethodType: 'bank_transfer',
    routingNumber: '010101010',
    iban: 'PK36ABCD0123456789012345',
    branchCode: '0101',
    description: 'Primary business account for bank transfers',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// Action types
type PaymentAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_ACCOUNTS'; payload: PaymentAccountDetails[] }
  | { type: 'ADD_ACCOUNT'; payload: PaymentAccountDetails }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; account: Partial<PaymentAccountDetails> } }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'TOGGLE_ACCOUNT_STATUS'; payload: string };

// Reducer
const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ACCOUNTS':
      return { ...state, accountDetails: action.payload, loading: false, error: undefined };
    case 'ADD_ACCOUNT':
      return { 
        ...state, 
        accountDetails: [...state.accountDetails, action.payload],
        loading: false,
        error: undefined
      };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accountDetails: state.accountDetails.map(account =>
          account.id === action.payload.id
            ? { ...account, ...action.payload.account, updatedAt: new Date() }
            : account
        ),
        loading: false,
        error: undefined
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accountDetails: state.accountDetails.filter(account => account.id !== action.payload),
        loading: false,
        error: undefined
      };
    case 'TOGGLE_ACCOUNT_STATUS':
      return {
        ...state,
        accountDetails: state.accountDetails.map(account =>
          account.id === action.payload
            ? { ...account, isActive: !account.isActive, updatedAt: new Date() }
            : account
        ),
        loading: false,
        error: undefined
      };
    default:
      return state;
  }
};

// Context type
interface PaymentContextType {
  state: PaymentState;
  paymentAccounts: PaymentAccountDetails[];
  addAccountDetails: (account: Omit<PaymentAccountDetails, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccountDetails: (id: string, account: Partial<PaymentAccountDetails>) => Promise<void>;
  deleteAccountDetails: (id: string) => Promise<void>;
  toggleAccountStatus: (id: string) => Promise<void>;
  getAccountById: (id: string) => PaymentAccountDetails | undefined;
}

// Create context
export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Initial state
const initialState: PaymentState = {
  accountDetails: mockPaymentAccounts,
  loading: false,
  error: undefined
};

// Provider component
export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const addAccountDetails = async (accountData: Omit<PaymentAccountDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAccount: PaymentAccountDetails = {
        ...accountData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add account details' });
      throw error;
    }
  };

  const updateAccountDetails = async (id: string, accountData: Partial<PaymentAccountDetails>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, account: accountData } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update account details' });
      throw error;
    }
  };

  const deleteAccountDetails = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete account details' });
      throw error;
    }
  };

  const toggleAccountStatus = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'TOGGLE_ACCOUNT_STATUS', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle account status' });
      throw error;
    }
  };

  const getAccountById = (id: string) => {
    return state.accountDetails.find(account => account.id === id);
  };

  const value: PaymentContextType = {
    state,
    paymentAccounts: state.accountDetails,
    addAccountDetails,
    updateAccountDetails,
    deleteAccountDetails,
    toggleAccountStatus,
    getAccountById
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Hook to use the payment context
export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}; 
