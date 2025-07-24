import React, { useState } from 'react';
import { FiDatabase, FiUpload, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useSupabaseProducts } from '../../context/SupabaseProductContext';

interface MigrationStatus {
  isConnected: boolean;
  hasLocalData: boolean;
  hasSupabaseData: boolean;
  localCount: number;
  supabaseCount: number;
}

const SupabaseMigration: React.FC = () => {
  const { migrateLocalData, state } = useSupabaseProducts();
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Check current status
  const checkStatus = async () => {
    setIsChecking(true);
    try {
      // Check localStorage
      const storedProducts = localStorage.getItem('miniworld_products');
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];
      
      // Check Supabase
      const supabaseProducts = state.products;

      setMigrationStatus({
        isConnected: !state.error,
        hasLocalData: localProducts.length > 0,
        hasSupabaseData: supabaseProducts.length > 0,
        localCount: localProducts.length,
        supabaseCount: supabaseProducts.length,
      });

      if (state.error) {
        setMessage('Unable to connect to Supabase. Please check your configuration.');
        setMessageType('error');
      } else if (supabaseProducts.length > 0) {
        setMessage('Database already contains products. Migration may not be needed.');
        setMessageType('info');
      } else if (localProducts.length > 0) {
        setMessage(`Found ${localProducts.length} products in local storage ready for migration.`);
        setMessageType('info');
      } else {
        setMessage('No products found in local storage.');
        setMessageType('info');
      }
    } catch (error: any) {
      setMessage(`Error checking status: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsChecking(false);
    }
  };

  // Perform migration
  const performMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateLocalData();
      
      if (result.success) {
        setMessage(result.message);
        setMessageType('success');
        // Refresh status after migration
        setTimeout(checkStatus, 1000);
      } else {
        setMessage(result.message);
        setMessageType('error');
      }
    } catch (error: any) {
      setMessage(`Migration failed: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsMigrating(false);
    }
  };

  // Check status on component mount
  React.useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <FiDatabase className="text-cyan-400 text-2xl" />
        <h2 className="text-xl font-bold text-white">Supabase Migration</h2>
      </div>

      {/* Status Display */}
      {migrationStatus && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${migrationStatus.isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-white font-medium">Supabase Connection</span>
            </div>
            <p className="text-sm text-slate-300">
              {migrationStatus.isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${migrationStatus.hasLocalData ? 'bg-yellow-400' : 'bg-slate-400'}`} />
              <span className="text-white font-medium">Local Storage</span>
            </div>
            <p className="text-sm text-slate-300">
              {migrationStatus.localCount} products
            </p>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${migrationStatus.hasSupabaseData ? 'bg-green-400' : 'bg-slate-400'}`} />
              <span className="text-white font-medium">Database</span>
            </div>
            <p className="text-sm text-slate-300">
              {migrationStatus.supabaseCount} products
            </p>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`rounded-lg p-4 mb-6 flex items-center gap-3 ${
          messageType === 'success' ? 'bg-green-900/50 border border-green-700' :
          messageType === 'error' ? 'bg-red-900/50 border border-red-700' :
          'bg-blue-900/50 border border-blue-700'
        }`}>
          {messageType === 'success' && <FiCheck className="text-green-400" />}
          {messageType === 'error' && <FiAlertCircle className="text-red-400" />}
          {messageType === 'info' && <FiDatabase className="text-blue-400" />}
          <p className="text-white">{message}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={checkStatus}
          disabled={isChecking}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isChecking ? <FiLoader className="animate-spin" /> : <FiDatabase />}
          {isChecking ? 'Checking...' : 'Check Status'}
        </button>

        <button
          onClick={performMigration}
          disabled={isMigrating || !migrationStatus?.isConnected || !migrationStatus?.hasLocalData}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {isMigrating ? <FiLoader className="animate-spin" /> : <FiUpload />}
          {isMigrating ? 'Migrating...' : 'Migrate Data'}
        </button>
      </div>

      {/* Migration Instructions */}
      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-white font-medium mb-2">Migration Steps:</h3>
        <ol className="text-sm text-slate-300 space-y-1">
          <li>1. Ensure Supabase is properly configured with your database URL and API key</li>
          <li>2. Run the SQL schema in your Supabase SQL editor</li>
          <li>3. Check the connection status above</li>
          <li>4. Click "Migrate Data" to transfer products from localStorage to Supabase</li>
          <li>5. Verify the migration completed successfully</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseMigration; 
