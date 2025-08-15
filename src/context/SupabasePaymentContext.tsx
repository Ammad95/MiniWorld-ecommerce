import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { PaymentAccountDetails, PaymentState } from '../types';

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
interface SupabasePaymentContextType {
  state: PaymentState;
  paymentAccounts: PaymentAccountDetails[];
  addAccountDetails: (account: Omit<PaymentAccountDetails, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAccountDetails: (id: string, account: Partial<PaymentAccountDetails>) => Promise<void>;
  deleteAccountDetails: (id: string) => Promise<void>;
  toggleAccountStatus: (id: string) => Promise<void>;
  getAccountById: (id: string) => PaymentAccountDetails | undefined;
  refreshAccounts: () => Promise<void>;
}

// Create context
const SupabasePaymentContext = createContext<SupabasePaymentContextType | undefined>(undefined);

// Helper functions for database operations
const formatAccountFromDB = (dbAccount: any): PaymentAccountDetails => ({
  id: dbAccount.id,
  accountName: dbAccount.account_name,
  accountNumber: dbAccount.account_number,
  bankName: dbAccount.bank_name,
  paymentMethodType: dbAccount.payment_method_type,
  routingNumber: dbAccount.routing_number || undefined,
  iban: dbAccount.iban || undefined,
  branchCode: dbAccount.branch_code || undefined,
  description: dbAccount.description || undefined,
  isActive: dbAccount.is_active,
  createdAt: new Date(dbAccount.created_at),
  updatedAt: new Date(dbAccount.updated_at)
});

const formatAccountForDB = (account: Partial<PaymentAccountDetails>) => ({
  account_name: account.accountName,
  account_number: account.accountNumber,
  bank_name: account.bankName,
  payment_method_type: account.paymentMethodType,
  routing_number: account.routingNumber,
  iban: account.iban,
  branch_code: account.branchCode,
  description: account.description,
  is_active: account.isActive
});

// Initial state
const initialState: PaymentState = {
  accountDetails: [],
  loading: false,
  error: undefined
};

// Provider component
export const SupabasePaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Fetch accounts from Supabase
  const fetchAccounts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('payment_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedAccounts = (data || []).map(formatAccountFromDB);
      dispatch({ type: 'SET_ACCOUNTS', payload: formattedAccounts });
    } catch (error) {
      console.error('Error fetching payment accounts:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch payment accounts' });
    }
  };

  // Load accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  const addAccountDetails = async (accountData: Omit<PaymentAccountDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const dbAccount = formatAccountForDB(accountData);
      
      const { data, error } = await supabase
        .from('payment_accounts')
        .insert([dbAccount])
        .select()
        .single();

      if (error) throw error;

      const formattedAccount = formatAccountFromDB(data);
      dispatch({ type: 'ADD_ACCOUNT', payload: formattedAccount });
    } catch (error) {
      console.error('Error adding payment account:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add payment account' });
      throw error;
    }
  };

  const updateAccountDetails = async (id: string, accountData: Partial<PaymentAccountDetails>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const dbAccount = formatAccountForDB(accountData);
      
      const { data, error } = await supabase
        .from('payment_accounts')
        .update(dbAccount)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const formattedAccount = formatAccountFromDB(data);
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, account: formattedAccount } });
    } catch (error) {
      console.error('Error updating payment account:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update payment account' });
      throw error;
    }
  };

  const deleteAccountDetails = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase
        .from('payment_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      dispatch({ type: 'DELETE_ACCOUNT', payload: id });
    } catch (error) {
      console.error('Error deleting payment account:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete payment account' });
      throw error;
    }
  };

  const toggleAccountStatus = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const currentAccount = state.accountDetails.find(acc => acc.id === id);
      if (!currentAccount) throw new Error('Account not found');

      const { data, error } = await supabase
        .from('payment_accounts')
        .update({ is_active: !currentAccount.isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const formattedAccount = formatAccountFromDB(data);
      dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, account: formattedAccount } });
    } catch (error) {
      console.error('Error toggling account status:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to toggle account status' });
      throw error;
    }
  };

  const getAccountById = (id: string) => {
    return state.accountDetails.find(account => account.id === id);
  };

  const refreshAccounts = async () => {
    await fetchAccounts();
  };

  const value: SupabasePaymentContextType = {
    state,
    paymentAccounts: state.accountDetails,
    addAccountDetails,
    updateAccountDetails,
    deleteAccountDetails,
    toggleAccountStatus,
    getAccountById,
    refreshAccounts
  };

  return (
    <SupabasePaymentContext.Provider value={value}>
      {children}
    </SupabasePaymentContext.Provider>
  );
};

// Hook to use the Supabase payment context
export const useSupabasePayment = () => {
  const context = useContext(SupabasePaymentContext);
  if (context === undefined) {
    throw new Error('useSupabasePayment must be used within a SupabasePaymentProvider');
  }
  return context;
};
