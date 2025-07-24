import React, { useState } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiEyeOff,
  FiCreditCard,
  FiDollarSign,
  FiToggleLeft,
  FiToggleRight,
  FiCheck
} from 'react-icons/fi';
import { PaymentAccountDetails } from '../../types';
import { usePayment } from '../../context/PaymentContext';
import AccountModal from '../../components/admin/AccountModal';

const PaymentAccountsManagement: React.FC = () => {
  const { state, deleteAccountDetails, toggleAccountStatus } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'bank_transfer'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [showSensitiveData, setShowSensitiveData] = useState<{ [key: string]: boolean }>({});

  const filteredAccounts = state.accountDetails.filter((account: PaymentAccountDetails) => {
    const matchesSearch = account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm);
    
    const matchesMethod = selectedMethod === 'all' || account.paymentMethodType === selectedMethod;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && account.isActive) ||
                         (statusFilter === 'inactive' && !account.isActive);

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'bank_transfer':
        return {
          icon: FiDollarSign,
          label: 'Bank Transfer',
          color: 'text-blue-600'
        };
      default:
        return {
          icon: FiCreditCard,
          label: 'Other',
          color: 'text-gray-600'
        };
    }
  };

  const handleEditAccount = (accountId: string) => {
    setEditingAccount(accountId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const toggleSensitiveData = (accountId: string) => {
    setShowSensitiveData(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this payment account?')) {
      try {
        await deleteAccountDetails(accountId);
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (accountId: string) => {
    try {
      await toggleAccountStatus(accountId);
    } catch (error) {
      console.error('Failed to toggle account status:', error);
      alert('Failed to update account status. Please try again.');
    }
  };

  // Calculate counts for different payment methods
  const counts = {
    total: state.accountDetails.length,
    active: state.accountDetails.filter((a: PaymentAccountDetails) => a.isActive).length,
    bank_transfer: state.accountDetails.filter((a: PaymentAccountDetails) => a.paymentMethodType === 'bank_transfer').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Accounts</h1>
          <p className="text-gray-600">Manage your payment method accounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Account</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
            <FiCreditCard className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-green-600">{counts.active}</p>
            </div>
            <FiCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bank Transfer</p>
              <p className="text-2xl font-bold text-blue-600">{counts.bank_transfer}</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Method Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value as 'all' | 'bank_transfer')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Methods</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedMethod('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <FiCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment accounts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedMethod !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first payment account.'
              }
            </p>
            {!searchTerm && selectedMethod === 'all' && statusFilter === 'all' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Add Payment Account
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => {
                  const methodInfo = getMethodIcon(account.paymentMethodType);
                  const IconComponent = methodInfo.icon;
                  const isDataVisible = showSensitiveData[account.id];

                  return (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {account.accountName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {account.bankName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Account: {isDataVisible 
                              ? account.accountNumber 
                              : '****' + account.accountNumber.slice(-4)
                            }
                          </div>
                          {account.iban && (
                            <div className="text-sm text-gray-500">
                              IBAN: {isDataVisible 
                                ? account.iban 
                                : '****' + account.iban.slice(-4)
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`w-5 h-5 ${methodInfo.color}`} />
                          <span className="text-sm text-gray-900">{methodInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(account.id)}
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            account.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {account.isActive ? (
                            <>
                              <FiToggleRight className="w-4 h-4" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <FiToggleLeft className="w-4 h-4" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleSensitiveData(account.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title={isDataVisible ? 'Hide sensitive data' : 'Show sensitive data'}
                          >
                            {isDataVisible ? (
                              <FiEyeOff className="w-4 h-4" />
                            ) : (
                              <FiEye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditAccount(account.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit account"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete account"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingAccountId={editingAccount}
      />
    </div>
  );
};

export default PaymentAccountsManagement; 
