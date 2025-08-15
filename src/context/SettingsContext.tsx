import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// Types for settings
export interface TaxSettings {
  rate: number;
  description: string;
}

export interface ShippingSettings {
  rate: number;
  free_shipping_threshold: number;
  description: string;
}

export interface CurrencySettings {
  code: string;
  symbol: string;
  name: string;
}

export interface SiteSettings {
  taxRate: TaxSettings;
  shippingRate: ShippingSettings;
  currency: CurrencySettings;
}

export interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  error: string | undefined;
}

// Action types
type SettingsAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_SETTINGS'; payload: SiteSettings }
  | { type: 'UPDATE_TAX_RATE'; payload: TaxSettings }
  | { type: 'UPDATE_SHIPPING_RATE'; payload: ShippingSettings }
  | { type: 'UPDATE_CURRENCY'; payload: CurrencySettings };

// Reducer
const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: false, error: undefined };
    case 'UPDATE_TAX_RATE':
      return {
        ...state,
        settings: { ...state.settings, taxRate: action.payload },
        loading: false,
        error: undefined
      };
    case 'UPDATE_SHIPPING_RATE':
      return {
        ...state,
        settings: { ...state.settings, shippingRate: action.payload },
        loading: false,
        error: undefined
      };
    case 'UPDATE_CURRENCY':
      return {
        ...state,
        settings: { ...state.settings, currency: action.payload },
        loading: false,
        error: undefined
      };
    default:
      return state;
  }
};

// Context type
interface SettingsContextType {
  state: SettingsState;
  updateTaxRate: (taxSettings: TaxSettings) => Promise<void>;
  updateShippingRate: (shippingSettings: ShippingSettings) => Promise<void>;
  updateCurrency: (currencySettings: CurrencySettings) => Promise<void>;
  refreshSettings: () => Promise<void>;
  calculateTax: (subtotal: number) => number;
  calculateShipping: (subtotal: number) => number;
}

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default settings
const defaultSettings: SiteSettings = {
  taxRate: { rate: 0.1, description: 'Tax rate (10%)' },
  shippingRate: { rate: 150, free_shipping_threshold: 5000, description: 'PKR 150 shipping, free over PKR 5,000' },
  currency: { code: 'PKR', symbol: 'PKR', name: 'Pakistani Rupee' }
};

// Initial state
const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  error: undefined
};

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Fetch settings from Supabase
  const fetchSettings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['tax_rate', 'shipping_rate', 'currency']);

      if (error) throw error;

      // Process settings data
      const settings: SiteSettings = { ...defaultSettings };
      
      data?.forEach((setting) => {
        switch (setting.setting_key) {
          case 'tax_rate':
            settings.taxRate = setting.setting_value as TaxSettings;
            break;
          case 'shipping_rate':
            settings.shippingRate = setting.setting_value as ShippingSettings;
            break;
          case 'currency':
            settings.currency = setting.setting_value as CurrencySettings;
            break;
        }
      });

      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      console.error('Error fetching settings:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch settings' });
    }
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const updateTaxRate = async (taxSettings: TaxSettings) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'tax_rate',
          setting_value: taxSettings,
          description: 'Default tax rate applied to orders'
        });

      if (error) throw error;

      dispatch({ type: 'UPDATE_TAX_RATE', payload: taxSettings });
    } catch (error) {
      console.error('Error updating tax rate:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update tax rate' });
      throw error;
    }
  };

  const updateShippingRate = async (shippingSettings: ShippingSettings) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'shipping_rate',
          setting_value: shippingSettings,
          description: 'Shipping rates and free shipping threshold'
        });

      if (error) throw error;

      dispatch({ type: 'UPDATE_SHIPPING_RATE', payload: shippingSettings });
    } catch (error) {
      console.error('Error updating shipping rate:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update shipping rate' });
      throw error;
    }
  };

  const updateCurrency = async (currencySettings: CurrencySettings) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: 'currency',
          setting_value: currencySettings,
          description: 'Default currency settings'
        });

      if (error) throw error;

      dispatch({ type: 'UPDATE_CURRENCY', payload: currencySettings });
    } catch (error) {
      console.error('Error updating currency:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update currency' });
      throw error;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  // Utility functions for calculations
  const calculateTax = (subtotal: number): number => {
    return subtotal * state.settings.taxRate.rate;
  };

  const calculateShipping = (subtotal: number): number => {
    return subtotal >= state.settings.shippingRate.free_shipping_threshold ? 0 : state.settings.shippingRate.rate;
  };

  const value: SettingsContextType = {
    state,
    updateTaxRate,
    updateShippingRate,
    updateCurrency,
    refreshSettings,
    calculateTax,
    calculateShipping
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
