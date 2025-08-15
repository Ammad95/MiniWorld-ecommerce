import React, { useState } from 'react';
import { 
  FiSettings, 
  FiSave, 
  FiRefreshCw, 
  FiDollarSign,
  FiTruck,
  FiPercent,
  FiGlobe
} from 'react-icons/fi';
import { useSettings, TaxSettings, ShippingSettings, CurrencySettings } from '../../context/SettingsContext';

const SettingsManagement: React.FC = () => {
  const { state, updateTaxRate, updateShippingRate, updateCurrency, refreshSettings } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [taxForm, setTaxForm] = useState<TaxSettings>({
    rate: state.settings.taxRate.rate,
    description: state.settings.taxRate.description
  });

  const [shippingForm, setShippingForm] = useState<ShippingSettings>({
    rate: state.settings.shippingRate.rate,
    free_shipping_threshold: state.settings.shippingRate.free_shipping_threshold,
    description: state.settings.shippingRate.description
  });

  const [currencyForm, setCurrencyForm] = useState<CurrencySettings>({
    code: state.settings.currency.code,
    symbol: state.settings.currency.symbol,
    name: state.settings.currency.name
  });

  // Update form states when settings change
  React.useEffect(() => {
    setTaxForm({
      rate: state.settings.taxRate.rate,
      description: state.settings.taxRate.description
    });
    setShippingForm({
      rate: state.settings.shippingRate.rate,
      free_shipping_threshold: state.settings.shippingRate.free_shipping_threshold,
      description: state.settings.shippingRate.description
    });
    setCurrencyForm({
      code: state.settings.currency.code,
      symbol: state.settings.currency.symbol,
      name: state.settings.currency.name
    });
  }, [state.settings]);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleTaxRateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateTaxRate(taxForm);
      showSuccessMessage('Tax rate updated successfully!');
    } catch (error) {
      console.error('Error updating tax rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShippingRateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateShippingRate(shippingForm);
      showSuccessMessage('Shipping settings updated successfully!');
    } catch (error) {
      console.error('Error updating shipping rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateCurrency(currencyForm);
      showSuccessMessage('Currency settings updated successfully!');
    } catch (error) {
      console.error('Error updating currency:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshSettings = async () => {
    setIsLoading(true);
    try {
      await refreshSettings();
      showSuccessMessage('Settings refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiSettings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings Management</h1>
            <p className="text-gray-600">Configure tax rates, shipping charges, and other site settings</p>
          </div>
        </div>
        
        <button
          onClick={handleRefreshSettings}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiPercent className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tax Settings</h2>
          </div>
          
          <form onSubmit={handleTaxRateUpdate} className="space-y-4">
            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="taxRate"
                  step="0.01"
                  min="0"
                  max="1"
                  value={taxForm.rate}
                  onChange={(e) => setTaxForm({ ...taxForm, rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  {(taxForm.rate * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="taxDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="taxDescription"
                value={taxForm.description}
                onChange={(e) => setTaxForm({ ...taxForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tax rate description"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>Update Tax Rate</span>
            </button>
          </form>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiTruck className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Shipping Settings</h2>
          </div>
          
          <form onSubmit={handleShippingRateUpdate} className="space-y-4">
            <div>
              <label htmlFor="shippingRate" className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Rate (PKR)
              </label>
              <input
                type="number"
                id="shippingRate"
                min="0"
                step="0.01"
                value={shippingForm.rate}
                onChange={(e) => setShippingForm({ ...shippingForm, rate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="150"
              />
            </div>
            
            <div>
              <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                Free Shipping Threshold (PKR)
              </label>
              <input
                type="number"
                id="freeShippingThreshold"
                min="0"
                step="0.01"
                value={shippingForm.free_shipping_threshold}
                onChange={(e) => setShippingForm({ ...shippingForm, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>
            
            <div>
              <label htmlFor="shippingDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="shippingDescription"
                value={shippingForm.description}
                onChange={(e) => setShippingForm({ ...shippingForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Shipping rate description"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>Update Shipping Settings</span>
            </button>
          </form>
        </div>

        {/* Currency Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <FiGlobe className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Currency Settings</h2>
          </div>
          
          <form onSubmit={handleCurrencyUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="currencyCode" className="block text-sm font-medium text-gray-700 mb-2">
                Currency Code
              </label>
              <input
                type="text"
                id="currencyCode"
                value={currencyForm.code}
                onChange={(e) => setCurrencyForm({ ...currencyForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PKR"
              />
            </div>
            
            <div>
              <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700 mb-2">
                Currency Symbol
              </label>
              <input
                type="text"
                id="currencySymbol"
                value={currencyForm.symbol}
                onChange={(e) => setCurrencyForm({ ...currencyForm, symbol: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PKR"
              />
            </div>
            
            <div>
              <label htmlFor="currencyName" className="block text-sm font-medium text-gray-700 mb-2">
                Currency Name
              </label>
              <input
                type="text"
                id="currencyName"
                value={currencyForm.name}
                onChange={(e) => setCurrencyForm({ ...currencyForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pakistani Rupee"
              />
            </div>
            
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>Update Currency Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Tax Rate</h3>
            <p className="text-green-700">{(taxForm.rate * 100).toFixed(1)}% on all orders</p>
            <p className="text-xs text-green-600 mt-1">{taxForm.description}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Shipping</h3>
            <p className="text-blue-700">{currencyForm.symbol} {shippingForm.rate.toLocaleString()}</p>
            <p className="text-blue-700">Free over {currencyForm.symbol} {shippingForm.free_shipping_threshold.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-1">{shippingForm.description}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Currency</h3>
            <p className="text-purple-700">{currencyForm.code} ({currencyForm.symbol})</p>
            <p className="text-xs text-purple-600 mt-1">{currencyForm.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
