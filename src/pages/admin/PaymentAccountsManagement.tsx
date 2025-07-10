import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiCreditCard, 
  FiArrowLeft, 
  FiSearch, 
  FiEdit3, 
  FiTrash2,
  FiPlus,
  FiEye,
  FiEyeOff,
  FiDollarSign,
  FiSmartphone,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { usePayment } from '../../context/PaymentContext';
import AccountModal from '../../components/admin/AccountModal';

const PaymentAccountsManagement: React.FC = () => {
  const { state, deleteAccountDetails, toggleAccountStatus } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'bank_transfer' | 'jazzcash' | 'easypaisa' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState<{ [key: string]: boolean }>({});

  const filteredAccounts = state.accountDetails.filter(account => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm);
    const matchesMethod = selectedMethod === 'all' || account.paymentMethodType === selectedMethod;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && account.isActive) ||
                         (statusFilter === 'inactive' && !account.isActive);
    
    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getPaymentMethodConfig = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return {
          icon: FiDollarSign,
          label: 'Bank Transfer',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        };
      case 'jazzcash':
        return {
          icon: FiSmartphone,
          label: 'JazzCash',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        };
      case 'easypaisa':
        return {
          icon: FiSmartphone,
          label: 'EasyPaisa',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      default:
        return {
          icon: FiCreditCard,
          label: 'Other',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const handleEdit = (accountId: string) => {
    setEditingAccount(accountId);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (accountId: string, accountName: string) => {
    if (window.confirm(`Are you sure you want to delete "${accountName}"? This action cannot be undone.`)) {
      deleteAccountDetails(accountId);
    }
  };

  const toggleSensitiveData = (accountId: string) => {
    setShowSensitiveData(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const maskSensitiveData = (data: string, show: boolean) => {
    if (show || !data) return data;
    if (data.length <= 4) return '*'.repeat(data.length);
    return data.substring(0, 4) + '*'.repeat(data.length - 4);
  };

  const getAccountCounts = () => {
    return {
      total: state.accountDetails.length,
      active: state.accountDetails.filter(a => a.isActive).length,
      bank_transfer: state.accountDetails.filter(a => a.paymentMethodType === 'bank_transfer').length,
      jazzcash: state.accountDetails.filter(a => a.paymentMethodType === 'jazzcash').length,
      easypaisa: state.accountDetails.filter(a => a.paymentMethodType === 'easypaisa').length,
    };
  };

  const counts = getAccountCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto container-padding py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-deepPurple-600 hover:text-deepPurple-800">
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Accounts</h1>
                <p className="text-gray-600 mt-1">Manage payment method configurations for your store</p>
              </div>
            </div>
            
            <motion.button
              onClick={handleAdd}
              className="btn-primary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Account</span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="container mx-auto container-padding py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
              </div>
              <FiCreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{counts.active}</p>
              </div>
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bank Transfer</p>
                <p className="text-2xl font-bold text-blue-600">{counts.bank_transfer}</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">JazzCash</p>
                <p className="text-2xl font-bold text-orange-600">{counts.jazzcash}</p>
              </div>
              <FiSmartphone className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">EasyPaisa</p>
                <p className="text-2xl font-bold text-green-600">{counts.easypaisa}</p>
              </div>
              <FiSmartphone className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
            
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as any)}
              className="form-input"
            >
              <option value="all">All Payment Methods</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="jazzcash">JazzCash</option>
              <option value="easypaisa">EasyPaisa</option>
              <option value="other">Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredAccounts.length} of {counts.total} accounts
            </div>
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Account Details</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Payment Method</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Account Number</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Additional Info</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAccounts.map((account) => {
                  const methodConfig = getPaymentMethodConfig(account.paymentMethodType);
                  const MethodIcon = methodConfig.icon;
                  const showSensitive = showSensitiveData[account.id];
                  
                  return (
                    <motion.tr 
                      key={account.id} 
                      className="hover:bg-gray-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{account.accountName}</div>
                          <div className="text-sm text-gray-500">{account.bankName}</div>
                          {account.description && (
                            <div className="text-xs text-gray-400 mt-1">{account.description}</div>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${methodConfig.bgColor} ${methodConfig.color}`}>
                          <MethodIcon className="w-4 h-4 mr-1" />
                          {methodConfig.label}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm">
                            {maskSensitiveData(account.accountNumber, showSensitive)}
                          </span>
                          <button
                            onClick={() => toggleSensitiveData(account.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            title={showSensitive ? 'Hide details' : 'Show details'}
                          >
                            {showSensitive ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                          </button>
                        </div>
                        {account.mobileNumber && (
                          <div className="text-sm text-gray-500 font-mono">
                            {maskSensitiveData(account.mobileNumber, showSensitive)}
                          </div>
                        )}
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="text-sm space-y-1">
                          {account.routingNumber && (
                            <div>
                              <span className="text-gray-500">Routing: </span>
                              <span className="font-mono">{maskSensitiveData(account.routingNumber, showSensitive)}</span>
                            </div>
                          )}
                          {account.iban && (
                            <div>
                              <span className="text-gray-500">IBAN: </span>
                              <span className="font-mono">{maskSensitiveData(account.iban, showSensitive)}</span>
                            </div>
                          )}
                          {account.merchantId && (
                            <div>
                              <span className="text-gray-500">Merchant ID: </span>
                              <span className="font-mono">{maskSensitiveData(account.merchantId, showSensitive)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => toggleAccountStatus(account.id)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            account.isActive
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {account.isActive ? <FiCheck className="w-4 h-4 mr-1" /> : <FiX className="w-4 h-4 mr-1" />}
                          {account.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(account.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit account"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id, account.accountName)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete account"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <FiCreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Accounts Found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first payment account.</p>
            <motion.button
              onClick={handleAdd}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Account
            </motion.button>
          </div>
        )}
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        accountId={editingAccount}
      />
    </div>
  );
};

export default PaymentAccountsManagement; 