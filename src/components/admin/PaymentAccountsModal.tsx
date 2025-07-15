import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiDollarSign,
  FiToggleLeft,
  FiToggleRight,
  FiSave
} from 'react-icons/fi';
import { usePayment } from '../../context/PaymentContext';
import { PaymentAccountDetails } from '../../types';

interface PaymentAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentAccountsModal: React.FC<PaymentAccountsModalProps> = ({ isOpen, onClose }) => {
  const { state: paymentState, addAccountDetails, updateAccountDetails, deleteAccountDetails, toggleAccountStatus } = usePayment();
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PaymentAccountDetails | null>(null);
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
    swiftCode: '',
    iban: '',
  });

  const resetForm = () => {
    setFormData({
      accountName: '',
      accountNumber: '',
      bankName: '',
      routingNumber: '',
      swiftCode: '',
      iban: '',
    });
    setIsAddingAccount(false);
    setEditingAccount(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAccount) {
      updateAccountDetails(editingAccount.id, {
        ...formData,
        isActive: editingAccount.isActive,
      });
    } else {
      addAccountDetails({
        ...formData,
        paymentMethodType: 'bank_transfer',
        isActive: true,
      });
    }
    
    resetForm();
  };

  const handleEdit = (account: PaymentAccountDetails) => {
    setEditingAccount(account);
    setFormData({
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      routingNumber: account.routingNumber || '',
      swiftCode: account.swiftCode || '',
      iban: account.iban || '',
    });
    setIsAddingAccount(true);
  };

  const handleDelete = (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this payment account?')) {
      deleteAccountDetails(accountId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-navy-200">
          <div className="flex items-center space-x-3">
            <FiDollarSign className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-navy-900">Payment Accounts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-navy-400 hover:text-navy-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-theme(spacing.24))]">
          {/* Add Account Button */}
          {!isAddingAccount && (
            <div className="mb-6">
              <button
                onClick={() => setIsAddingAccount(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <FiPlus className="w-5 h-5" />
                <span>Add New Account</span>
              </button>
            </div>
          )}

          {/* Add/Edit Account Form */}
          <AnimatePresence>
            {isAddingAccount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-200"
              >
                <h3 className="text-lg font-semibold text-navy-900 mb-4">
                  {editingAccount ? 'Edit Account' : 'Add New Account'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        Account Name *
                      </label>
                      <input
                        type="text"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        className="w-full px-3 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="e.g., MiniHub Business Account"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Account number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-3 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Bank name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        value={formData.routingNumber}
                        onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Routing number (optional)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        SWIFT Code
                      </label>
                      <input
                        type="text"
                        value={formData.swiftCode}
                        onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                        className="w-full px-3 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="SWIFT code (optional)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={formData.iban}
                        onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                        className="w-full px-3 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="IBAN (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="btn-primary flex items-center space-x-2"
                    >
                      <FiSave className="w-4 h-4" />
                      <span>{editingAccount ? 'Update Account' : 'Save Account'}</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-navy-300 text-navy-600 rounded-lg hover:bg-navy-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Accounts List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy-900">Configured Accounts</h3>
            
            {paymentState.accountDetails.length === 0 ? (
              <div className="text-center py-8 text-navy-600">
                <FiDollarSign className="w-12 h-12 mx-auto mb-4 text-navy-300" />
                <p>No payment accounts configured yet.</p>
                <p className="text-sm">Add your first account to enable bank transfer payments.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paymentState.accountDetails.map((account) => (
                  <div
                    key={account.id}
                    className={`p-4 rounded-lg border ${
                      account.isActive
                        ? 'border-green-200 bg-green-50'
                        : 'border-navy-200 bg-navy-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-navy-900">{account.accountName}</h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              account.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-navy-100 text-navy-600'
                            }`}
                          >
                            {account.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-navy-600">
                          <div><strong>Bank:</strong> {account.bankName}</div>
                          <div><strong>Account:</strong> {account.accountNumber}</div>
                          {account.routingNumber && (
                            <div><strong>Routing:</strong> {account.routingNumber}</div>
                          )}
                          {account.swiftCode && (
                            <div><strong>SWIFT:</strong> {account.swiftCode}</div>
                          )}
                          {account.iban && (
                            <div><strong>IBAN:</strong> {account.iban}</div>
                          )}
                        </div>
                        
                        <div className="text-xs text-navy-500 mt-2">
                          Created: {account.createdAt.toLocaleDateString()}
                          {account.updatedAt.getTime() !== account.createdAt.getTime() && (
                            <> • Updated: {account.updatedAt.toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => toggleAccountStatus(account.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            account.isActive
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-navy-400 hover:bg-navy-100'
                          }`}
                          title={account.isActive ? 'Deactivate account' : 'Activate account'}
                        >
                          {account.isActive ? (
                            <FiToggleRight className="w-5 h-5" />
                          ) : (
                            <FiToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleEdit(account)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit account"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete account"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentAccountsModal; 
