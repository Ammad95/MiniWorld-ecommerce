import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiSave, 
  FiEye,
  FiEyeOff,
  FiInfo
} from 'react-icons/fi';
import { useSupabasePayment } from '../../context/SupabasePaymentContext';

interface FormData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  paymentMethodType: 'bank_transfer';
  routingNumber: string;
  swiftCode: string;
  iban: string;
  branchCode: string;
  description: string;
  isActive: boolean;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccountId?: string | null;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  editingAccountId
}) => {
  const { addAccountDetails, updateAccountDetails, getAccountById } = useSupabasePayment();
  const [formData, setFormData] = useState<FormData>({
    accountName: '',
    accountNumber: '',
    bankName: '',
    paymentMethodType: 'bank_transfer',
    routingNumber: '',
    swiftCode: '',
    iban: '',
    branchCode: '',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSensitiveFields, setShowSensitiveFields] = useState(false);

  // Load account data for editing
  useEffect(() => {
    if (editingAccountId) {
      const account = getAccountById(editingAccountId);
      if (account) {
        setFormData({
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          bankName: account.bankName,
          paymentMethodType: account.paymentMethodType as 'bank_transfer',
          routingNumber: account.routingNumber || '',
          swiftCode: account.swiftCode || '',
          iban: account.iban || '',
          branchCode: account.branchCode || '',
          description: account.description || '',
          isActive: account.isActive
        });
      }
    } else {
      // Reset form for new account
      setFormData({
        accountName: '',
        accountNumber: '',
        bankName: '',
        paymentMethodType: 'bank_transfer',
        routingNumber: '',
        swiftCode: '',
        iban: '',
        branchCode: '',
        description: '',
        isActive: true
      });
    }
  }, [editingAccountId, getAccountById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Common validations
    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    // Bank transfer specific validations
    if (formData.paymentMethodType === 'bank_transfer') {
      if (formData.iban && formData.iban.length < 15) {
        newErrors.iban = 'IBAN must be at least 15 characters';
      }
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
        ...formData,
        // Clean up empty optional fields
        routingNumber: formData.routingNumber || undefined,
        swiftCode: formData.swiftCode || undefined,
        iban: formData.iban || undefined,
        branchCode: formData.branchCode || undefined,
        description: formData.description || undefined,
      };

      if (editingAccountId) {
        await updateAccountDetails(editingAccountId, accountData);
      } else {
        await addAccountDetails(accountData);
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save account:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholderText = () => {
    switch (formData.paymentMethodType) {
      case 'bank_transfer':
        return {
          accountNumber: 'e.g., 1234567890123456',
          bankName: 'e.g., Allied Bank Limited'
        };
      default:
        return {
          accountNumber: 'Enter account number',
          bankName: 'Enter bank/provider name'
        };
    }
  };

  const getFieldsToShow = () => {
    const fields = {
      showRouting: false,
      showSwift: false,
      showIban: false,
      showBranch: false,
    };

    switch (formData.paymentMethodType) {
      case 'bank_transfer':
        fields.showRouting = true;
        fields.showSwift = true;
        fields.showIban = true;
        fields.showBranch = true;
        break;
    }

    return fields;
  };

  const placeholders = getPlaceholderText();
  const fieldsToShow = getFieldsToShow();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editingAccountId ? 'Edit Payment Account' : 'Add Payment Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method Type *
            </label>
            <select
              name="paymentMethodType"
              value={formData.paymentMethodType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={!!editingAccountId} // Don't allow changing type when editing
            >
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name *
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                placeholder="Business Account Name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.accountName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accountName && (
                <p className="mt-1 text-sm text-red-600">{errors.accountName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank/Provider Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder={placeholders.bankName}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankName && (
                <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
              Account Number *
              <button
                type="button"
                onClick={() => setShowSensitiveFields(!showSensitiveFields)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showSensitiveFields ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </label>
            <input
              type={showSensitiveFields ? "text" : "password"}
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              placeholder={placeholders.accountNumber}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
            )}
          </div>

          {/* Bank Transfer Specific Fields */}
          {fieldsToShow.showIban && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN
                </label>
                <input
                  type={showSensitiveFields ? "text" : "password"}
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  placeholder="PK36ABCD0123456789012345"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.iban ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.iban && (
                  <p className="mt-1 text-sm text-red-600">{errors.iban}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Code
                </label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleInputChange}
                  placeholder="0101"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {fieldsToShow.showRouting && fieldsToShow.showSwift && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleInputChange}
                  placeholder="010101010"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleInputChange}
                  placeholder="ABCDPKKA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Optional description or notes about this account"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Active (account is available for payments)
            </label>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FiInfo className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Security Notice</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Account details are stored securely and only visible to authorized administrators.
                  Sensitive information is masked by default for additional security.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal; 
