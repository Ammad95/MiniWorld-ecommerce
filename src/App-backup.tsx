import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { ProductProvider } from './context/ProductContext';
import { PaymentProvider } from './context/PaymentContext';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/common/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ChangePassword from './pages/admin/ChangePassword';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import PaymentAccountsManagement from './pages/admin/PaymentAccountsManagement';
import OrderManagement from './pages/admin/OrderManagement';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import JazzCashSuccess from './pages/JazzCashSuccess';
import JazzCashCancel from './pages/JazzCashCancel';

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <ProductProvider>
          <PaymentProvider>
            <OrderProvider>
              <CartProvider>
                <Router>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="category/:categoryId" element={<CategoryPage />} />
                      <Route path="product/:productId" element={<ProductDetailsPage />} />
                      <Route path="cart" element={<CartPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route path="orders" element={<OrderHistoryPage />} />
                      <Route path="order/:orderId" element={<OrderDetailsPage />} />
                    </Route>

                    {/* JazzCash Payment Routes */}
                    <Route path="/checkout/jazzcash/success" element={<JazzCashSuccess />} />
                    <Route path="/checkout/jazzcash/cancel" element={<JazzCashCancel />} />

                    {/* Customer Authentication Routes */}
                    <Route path="/customer/login" element={<CustomerLogin />} />
                    <Route path="/customer/register" element={<CustomerRegister />} />
                    <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                    <Route path="/customer/forgot-password" element={<ForgotPassword />} />
                    <Route path="/customer/reset-password" element={<ResetPassword />} />

                    {/* Admin Authentication */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Admin Routes with Layout */}
                    <Route path="/admin" element={
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
                      <Route path="change-password" element={<ChangePassword />} />
                      {/* Placeholder routes for future features */}
                      <Route path="customers" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-900">Customers Management</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                      <Route path="analytics" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-900">Analytics</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                      <Route path="communications" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-900">Communications</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                      <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-600 mt-2">Coming soon...</p></div>} />
                    </Route>
                  </Routes>
                </Router>
              </CartProvider>
            </OrderProvider>
          </PaymentProvider>
        </ProductProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}

export default App; 