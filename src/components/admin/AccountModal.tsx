import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiX, 
  FiDollarSign, 
  FiSmartphone, 
  FiCreditCard, 
  FiEye, 
  FiEyeOff,
  FiCheck,
  FiAlertTriangle
} from 'react-icons/fi';
import { usePayment } from '../../context/PaymentContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId?: string | null;
}

interface FormData {
  accountName: string;
  bankName: string;
  paymentMethodType: 'bank_transfer' | 'jazzcash' | 'easypaisa' | 'other';
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban: string;
  mobileNumber: string;
  merchantId: string;
  apiKey: string;
  apiSecret: string;
  branchCode: string;
  description: string;
  isActive: boolean;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, accountId }) => {
  const { state, addAccountDetails, updateAccountDetails } = usePayment();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormData>({
    accountName: '',
    bankName: '',
    paymentMethodType: 'bank_transfer',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    iban: '',
    mobileNumber: '',
    merchantId: '',
    apiKey: '',
    apiSecret: '',
    branchCode: '',
    description: '',
    isActive: true,
  });

  // Load existing account data when editing
  useEffect(() => {
    if (accountId && isOpen) {
      const account = state.accountDetails.find(acc => acc.id === accountId);
      if (account) {
        setFormData({
          accountName: account.accountName,
          bankName: account.bankName,
          paymentMethodType: account.paymentMethodType,
          accountNumber: account.accountNumber,
          routingNumber: account.routingNumber || '',
          swiftCode: account.swiftCode || '',
          iban: account.iban || '',
          mobileNumber: account.mobileNumber || '',
          merchantId: account.merchantId || '',
          apiKey: account.apiKey || '',
          apiSecret: account.apiSecret || '',
          branchCode: account.branchCode || '',
          description: account.description || '',
          isActive: account.isActive,
        });
      }
    } else if (!accountId && isOpen) {
      // Reset form for new account
      setFormData({
        accountName: '',
        bankName: '',
        paymentMethodType: 'bank_transfer',
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        iban: '',
        mobileNumber: '',
        merchantId: '',
        apiKey: '',
        apiSecret: '',
        branchCode: '',
        description: '',
        isActive: true,
      });
    }
    setErrors({});
    setShowSensitive(false);
  }, [accountId, isOpen, state.accountDetails]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Common validations
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank/Provider name is required';
    }

    // Payment method specific validations
    switch (formData.paymentMethodType) {
      case 'bank_transfer':
        if (!formData.accountNumber.trim()) {
          newErrors.accountNumber = 'Account number is required';
        }
        if (!formData.routingNumber.trim()) {
          newErrors.routingNumber = 'Routing number is required for bank transfers';
        }
        break;

      case 'jazzcash':
      case 'easypaisa':
        if (!formData.mobileNumber.trim()) {
          newErrors.mobileNumber = 'Mobile number is required for mobile wallets';
        } else if (!/^(\+92|0)?3\d{9}$/.test(formData.mobileNumber.replace(/\s+/g, ''))) {
          newErrors.mobileNumber = 'Please enter a valid Pakistani mobile number';
        }
        if (!formData.merchantId.trim()) {
          newErrors.merchantId = 'Merchant ID is required for mobile wallet integration';
        }
        break;

      case 'other':
        if (!formData.accountNumber.trim()) {
          newErrors.accountNumber = 'Account identifier is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const accountData = {
        accountName: formData.accountName.trim(),
        bankName: formData.bankName.trim(),
        paymentMethodType: formData.paymentMethodType,
        accountNumber: formData.accountNumber.trim(),
        routingNumber: formData.routingNumber.trim() || undefined,
        swiftCode: formData.swiftCode.trim() || undefined,
        iban: formData.iban.trim() || undefined,
        mobileNumber: formData.mobileNumber.trim() || undefined,
        merchantId: formData.merchantId.trim() || undefined,
        apiKey: formData.apiKey.trim() || undefined,
        apiSecret: formData.apiSecret.trim() || undefined,
        branchCode: formData.branchCode.trim() || undefined,
        description: formData.description.trim() || undefined,
        isActive: formData.isActive,
      };

      if (accountId) {
        updateAccountDetails(accountId, accountData);
      } else {
        addAccountDetails(accountData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving account:', error);
      setErrors({ submit: 'Failed to save account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentMethodFields = () => {
    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name *
            </label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
              className={`form-input ${errors.accountName ? 'border-red-500' : ''}`}
              placeholder="e.g., MiniWorld Business Account"
            />
            {errors.accountName && (
              <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.paymentMethodType === 'bank_transfer' ? 'Bank Name' : 'Provider Name'} *
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              className={`form-input ${errors.bankName ? 'border-red-500' : ''}`}
              placeholder={
                formData.paymentMethodType === 'bank_transfer' 
                  ? 'e.g., First National Bank' 
                  : 'e.g., JazzCash'
              }
            />
            {errors.bankName && (
              <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="form-input h-20"
            placeholder="Optional description for this payment account"
          />
        </div>
      </>
    );

    switch (formData.paymentMethodType) {
      case 'bank_transfer':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className={`form-input ${errors.accountNumber ? 'border-red-500' : ''}`}
                  placeholder="1234567890"
                />
                {errors.accountNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Routing Number *
                </label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, routingNumber: e.target.value }))}
                  className={`form-input ${errors.routingNumber ? 'border-red-500' : ''}`}
                  placeholder="123456789"
                />
                {errors.routingNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.routingNumber}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, swiftCode: e.target.value }))}
                  className="form-input"
                  placeholder="ABCDPKKA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN
                </label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                  className="form-input"
                  placeholder="PK36SCBL0000001123456702"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Code
                </label>
                <input
                  type="text"
                  value={formData.branchCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, branchCode: e.target.value }))}
                  className="form-input"
                  placeholder="001"
                />
              </div>
            </div>
          </>
        );

      case 'jazzcash':
      case 'easypaisa':
        return (
          <>
            {commonFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  className={`form-input ${errors.mobileNumber ? 'border-red-500' : ''}`}
                  placeholder="+92 300 1234567"
                />
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant ID *
                </label>
                <input
                  type="text"
                  value={formData.merchantId}
                  onChange={(e) => setFormData(prev => ({ ...prev, merchantId: e.target.value }))}
                  className={`form-input ${errors.merchantId ? 'border-red-500' : ''}`}
                  placeholder="MC12345"
                />
                {errors.merchantId && (
                  <p className="text-red-500 text-xs mt-1">{errors.merchantId}</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">API Configuration</h4>
                <button
                  type="button"
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  {showSensitive ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  <span>{showSensitive ? 'Hide' : 'Show'} Sensitive Data</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type={showSensitive ? "text" : "password"}
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="form-input"
                    placeholder="Enter API key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Secret
                  </label>
                  <input
                    type={showSensitive ? "text" : "password"}
                    value={formData.apiSecret}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiSecret: e.target.value }))}
                    className="form-input"
                    placeholder="Enter API secret"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'other':
        return (
          <>
            {commonFields}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Identifier *
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                className={`form-input ${errors.accountNumber ? 'border-red-500' : ''}`}
                placeholder="Enter account identifier"
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
              )}
            </div>
          </>
        );

      default:
        return commonFields;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {accountId ? 'Edit Payment Account' : 'Add Payment Account'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'bank_transfer', label: 'Bank Transfer', icon: FiDollarSign },
                { value: 'jazzcash', label: 'JazzCash', icon: FiSmartphone },
                { value: 'easypaisa', label: 'EasyPaisa', icon: FiSmartphone },
                { value: 'other', label: 'Other', icon: FiCreditCard },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethodType: value as any }))}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                    formData.paymentMethodType === value
                      ? 'border-deepPurple-500 bg-deepPurple-50 text-deepPurple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Form Fields */}
          <div className="space-y-4">
            {getPaymentMethodFields()}
          </div>

          {/* Account Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-deepPurple-600"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Account is active and available for payments
            </label>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 text-sm">{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 px-6 py-2 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>{accountId ? 'Update' : 'Add'} Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AccountModal; 