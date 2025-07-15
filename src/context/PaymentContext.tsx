import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PaymentState, PaymentAccountDetails } from '../types';

interface PaymentContextType {
  state: PaymentState;
  addAccountDetails: (account: Omit<PaymentAccountDetails, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAccountDetails: (id: string, account: Partial<PaymentAccountDetails>) => void;
  deleteAccountDetails: (id: string) => void;
  toggleAccountStatus: (id: string) => void;
  getActiveAccounts: () => PaymentAccountDetails[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

type PaymentAction =
  | { type: 'ADD_ACCOUNT'; payload: PaymentAccountDetails }
  | { type: 'UPDATE_ACCOUNT'; payload: { id: string; updates: Partial<PaymentAccountDetails> } }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'TOGGLE_ACCOUNT_STATUS'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined };

const initialState: PaymentState = {
  accountDetails: [
    // Bank Transfer Account
    {
      id: '1',
      accountName: 'MiniHub Business Account',
      accountNumber: '1234567890',
      bankName: 'First National Bank',
      paymentMethodType: 'bank_transfer',
      routingNumber: '123456789',
      iban: 'PK36SCBL0000001123456702',
      swiftCode: 'ABCDPKKA',
      description: 'Main business account for bank transfers',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // JazzCash Account
    {
      id: '2',
      accountName: 'MiniHub JazzCash Business',
      accountNumber: 'JC789012',
      bankName: 'JazzCash Pakistan',
      paymentMethodType: 'jazzcash',
      mobileNumber: '+92 300 1234567',
      merchantId: 'MC12345',
      apiKey: 'jc_test_api_key_123',
      apiSecret: 'jc_test_secret_456',
      description: 'JazzCash mobile wallet for instant payments',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // EasyPaisa Account
    {
      id: '3',
      accountName: 'MiniHub EasyPaisa Store',
      accountNumber: 'EP345678',
      bankName: 'EasyPaisa by Telenor',
      paymentMethodType: 'easypaisa',
      mobileNumber: '+92 321 9876543',
      merchantId: 'EP67890',
      apiKey: 'ep_test_api_key_789',
      apiSecret: 'ep_test_secret_012',
      description: 'EasyPaisa mobile wallet integration',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Secondary Bank Account (Inactive for demo)
    {
      id: '4',
      accountName: 'MiniHub Savings Account',
      accountNumber: '9876543210',
      bankName: 'Allied Bank Limited',
      paymentMethodType: 'bank_transfer',
      routingNumber: '987654321',
      iban: 'PK24ABPA0000001234567890',
      branchCode: '001',
      description: 'Secondary bank account (currently inactive)',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  loading: false,
  error: undefined,
};

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'ADD_ACCOUNT':
      return {
        ...state,
        accountDetails: [...state.accountDetails, action.payload],
        error: undefined,
      };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accountDetails: state.accountDetails.map(account =>
          account.id === action.payload.id
            ? { ...account, ...action.payload.updates, updatedAt: new Date() }
            : account
        ),
        error: undefined,
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accountDetails: state.accountDetails.filter(account => account.id !== action.payload),
        error: undefined,
      };
    case 'TOGGLE_ACCOUNT_STATUS':
      return {
        ...state,
        accountDetails: state.accountDetails.map(account =>
          account.id === action.payload
            ? { ...account, isActive: !account.isActive, updatedAt: new Date() }
            : account
        ),
        error: undefined,
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

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const addAccountDetails = (account: Omit<PaymentAccountDetails, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: PaymentAccountDetails = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount });
  };

  const updateAccountDetails = (id: string, updates: Partial<PaymentAccountDetails>) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: { id, updates } });
  };

  const deleteAccountDetails = (id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  };

  const toggleAccountStatus = (id: string) => {
    dispatch({ type: 'TOGGLE_ACCOUNT_STATUS', payload: id });
  };

  const getActiveAccounts = (): PaymentAccountDetails[] => {
    return state.accountDetails.filter(account => account.isActive);
  };

  const value: PaymentContextType = {
    state,
    addAccountDetails,
    updateAccountDetails,
    deleteAccountDetails,
    toggleAccountStatus,
    getActiveAccounts,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}; 
