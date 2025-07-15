import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { supabase } from '../lib/supabase';

interface AuthDebugInfo {
  supabaseSession: any;
  customerAuthState: any;
  supabaseUser: any;
  customerProfile: any;
}

const CustomerAuthDebug: React.FC = () => {
  const { state } = useCustomerAuth();
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const collectDebugInfo = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      
      let customerProfile = null;
      if (user) {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', user.id)
          .single();
        
        customerProfile = { data, error: error?.message };
      }

      setDebugInfo({
        supabaseSession: session,
        customerAuthState: state,
        supabaseUser: user,
        customerProfile
      });
    } catch (error) {
      console.error('Debug info collection failed:', error);
    }
  };

  useEffect(() => {
    if (showDebug) {
      collectDebugInfo();
    }
  }, [showDebug, state]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
      >
        {showDebug ? 'Hide' : 'Debug Auth'}
      </button>
      
      {showDebug && debugInfo && (
        <div className="mt-2 bg-black text-white p-4 rounded max-w-md max-h-96 overflow-auto text-xs">
          <h3 className="font-bold mb-2">Customer Auth Debug</h3>
          
          <div className="mb-2">
            <strong>Auth State:</strong>
            <pre className="bg-gray-800 p-1 rounded mt-1">
              {JSON.stringify({
                isAuthenticated: state.isAuthenticated,
                isLoading: state.isLoading,
                error: state.error,
                customerExists: !!state.customer,
                customerEmail: state.customer?.email
              }, null, 2)}
            </pre>
          </div>

          <div className="mb-2">
            <strong>Supabase Session:</strong>
            <pre className="bg-gray-800 p-1 rounded mt-1">
              {JSON.stringify({
                hasSession: !!debugInfo.supabaseSession,
                userEmail: debugInfo.supabaseSession?.user?.email,
                userId: debugInfo.supabaseSession?.user?.id
              }, null, 2)}
            </pre>
          </div>

          <div className="mb-2">
            <strong>Customer Profile:</strong>
            <pre className="bg-gray-800 p-1 rounded mt-1">
              {JSON.stringify({
                hasProfile: !!debugInfo.customerProfile?.data,
                profileEmail: debugInfo.customerProfile?.data?.email,
                error: debugInfo.customerProfile?.error
              }, null, 2)}
            </pre>
          </div>

          <button
            onClick={collectDebugInfo}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerAuthDebug; 