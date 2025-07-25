import { Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { SupabaseAuthProvider } from './context/SupabaseAuthContext';
import { SupabaseProductProvider } from './context/SupabaseProductContext';
import { SupabaseOrderProvider } from './context/SupabaseOrderContext';
import { PaymentProvider } from './context/PaymentContext';

// Admin Components and Pages
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ChangePassword from './pages/admin/ChangePassword';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import PaymentAccountsManagement from './pages/admin/PaymentAccountsManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Communications from './pages/admin/Communications';

function AdminApp() {
  return (
    <SupabaseAuthProvider>
      <SupabaseProductProvider>
        <SupabaseOrderProvider>
          <PaymentProvider>
            <Routes>
              {/* Admin Authentication */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Admin Routes with Layout */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="payments" element={<PaymentAccountsManagement />} />
                <Route path="communications" element={<Communications />} />
                <Route path="change-password" element={<ChangePassword />} />
                
                {/* Placeholder routes for future features */}
                <Route path="analytics" element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                } />
                <Route path="reports" element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                } />
                <Route path="settings" element={
                  <div className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                  </div>
                } />
              </Route>

              {/* Catch-all redirect to dashboard */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </PaymentProvider>
        </SupabaseOrderProvider>
      </SupabaseProductProvider>
    </SupabaseAuthProvider>
  );
}

export default AdminApp; 
