import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import EmailService from '../../services/EmailService';

const EmailTestPanel: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      setResult({ success: false, message: 'Please enter an email address' });
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const success = await EmailService.sendTestEmail(testEmail.trim());
      
      if (success) {
        setResult({ 
          success: true, 
          message: 'Test email sent successfully! Check your inbox (including spam folder).' 
        });
      } else {
        setResult({ 
          success: false, 
          message: 'Failed to send test email. Check console for details.' 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'Error sending test email. Please try again.' 
      });
    } finally {
      setTesting(false);
    }
  };

  const stats = EmailService.getNotificationStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FiMail className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Email Test Panel</h3>
          <p className="text-sm text-gray-600">Test your email configuration</p>
        </div>
      </div>

      {/* Email Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Sent</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Test Email Form */}
      <div className="space-y-4">
        <div>
          <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Test Email Address
          </label>
          <div className="flex gap-3">
            <input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email address to test"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={testing}
            />
            <button
              onClick={handleTestEmail}
              disabled={testing || !testEmail.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {testing ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiMail className="w-4 h-4" />
                  Send Test
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-md flex items-start gap-3 ${
              result.success 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {result.success ? (
              <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <FiX className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {result.success ? 'Success!' : 'Error'}
              </p>
              <p className="text-sm mt-1">{result.message}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Configuration Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email Provider</span>
            <span className="text-sm font-medium text-gray-900">
              {import.meta.env.VITE_RESEND_API_KEY ? 'Resend' : 'Simulation Mode'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">API Key</span>
            <span className={`text-sm font-medium ${
              import.meta.env.VITE_RESEND_API_KEY ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {import.meta.env.VITE_RESEND_API_KEY ? 'Configured' : 'Not Set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">From Email</span>
            <span className="text-sm font-medium text-gray-900">
              {import.meta.env.VITE_EMAIL_FROM || 'support@minihubpk.com'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Environment</span>
            <span className={`text-sm font-medium ${
              import.meta.env.DEV ? 'text-blue-600' : 'text-green-600'
            }`}>
              {import.meta.env.DEV ? 'Development' : 'Production'}
            </span>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      {!import.meta.env.VITE_RESEND_API_KEY && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Setup Required
          </h4>
          <p className="text-sm text-yellow-700 mb-3">
            To send real emails, you need to configure your email provider.
          </p>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Create account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">resend.com</a></li>
            <li>Add domain: miniworldpk.com</li>
            <li>Get API key and add to .env file</li>
            <li>Add DNS records to GoDaddy</li>
          </ol>
        </div>
      )}
    </motion.div>
  );
};

export default EmailTestPanel; 
