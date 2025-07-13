import React, { useState } from 'react';
import { supabase } from './lib/supabase';

const DebugAuth: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      // Test 1: Basic connection
      addResult('🔍 Testing Supabase connection...');
      const { data, error } = await supabase.from('admin_users').select('count');
      
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`);
        return;
      }
      
      addResult('✅ Supabase connection successful');

      // Test 2: Check if admin_users table exists and has data
      addResult('🔍 Checking admin_users table...');
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('*');
      
      if (adminError) {
        addResult(`❌ Error accessing admin_users: ${adminError.message}`);
        return;
      }
      
      addResult(`✅ Found ${adminUsers?.length || 0} admin users`);
      
      if (adminUsers && adminUsers.length > 0) {
        adminUsers.forEach(user => {
          addResult(`👤 Admin: ${user.email} (${user.role}) - Active: ${user.is_active}`);
        });
      }

      // Test 3: Check for specific user
      addResult('🔍 Looking for ammaad_777@hotmail.com...');
      const { data: specificUser, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', 'ammaad_777@hotmail.com')
        .single();
      
      if (userError) {
        addResult(`❌ User not found in admin_users: ${userError.message}`);
        addResult('💡 Need to run the fix-admin-user.sql script');
      } else {
        addResult(`✅ Found admin user: ${specificUser.name} (${specificUser.role})`);
      }

      // Test 4: Check Supabase Auth
      addResult('🔍 Checking Supabase Auth session...');
      const { data: session } = await supabase.auth.getSession();
      
      if (session.session) {
        addResult(`✅ Auth session active: ${session.session.user.email}`);
      } else {
        addResult('ℹ️ No active auth session (this is normal for logged out state)');
      }

    } catch (error: any) {
      addResult(`❌ Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    addResult('🔐 Testing login with ammaad_777@hotmail.com...');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'ammaad_777@hotmail.com',
        password: 'MyMW@123'
      });
      
      if (error) {
        addResult(`❌ Auth login failed: ${error.message}`);
      } else {
        addResult(`✅ Auth login successful: ${data.user.email}`);
        
        // Now check admin_users table
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', data.user.email)
          .eq('is_active', true)
          .single();
        
        if (adminError) {
          addResult(`❌ Admin user lookup failed: ${adminError.message}`);
        } else {
          addResult(`✅ Admin user found: ${adminUser.name} (${adminUser.role})`);
        }
      }
    } catch (error: any) {
      addResult(`❌ Login test error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔧 Supabase Auth Debug Tool</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          Test Connection & Tables
        </button>
        
        <button 
          onClick={testLogin}
          disabled={loading}
          style={{ padding: '10px 20px' }}
        >
          Test Login
        </button>
      </div>
      
      {loading && <p>🔄 Running tests...</p>}
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {results.length === 0 ? (
          <p>Click a button to run tests</p>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              {result}
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#e7f3ff', borderRadius: '5px' }}>
        <h3>💡 Quick Fixes:</h3>
        <p><strong>If admin_users table is empty:</strong> Run the fix-admin-user.sql script in Supabase SQL Editor</p>
        <p><strong>If auth fails:</strong> Check password in Supabase Auth → Users</p>
        <p><strong>If connection fails:</strong> Check .env file for correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</p>
      </div>
    </div>
  );
};

export default DebugAuth; 