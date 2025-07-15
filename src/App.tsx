import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { SupabaseProductProvider } from './context/SupabaseProductContext';
import { PaymentProvider } from './context/PaymentContext';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerRegister from './pages/customer/CustomerRegister';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import ForgotPassword from './pages/customer/ForgotPassword';
import ResetPassword from './pages/customer/ResetPassword';
import JazzCashSuccess from './pages/JazzCashSuccess';
import JazzCashCancel from './pages/JazzCashCancel';
import CustomerAuthDebug from './components/CustomerAuthDebug';

// Lazy load the entire Admin application
const AdminApp = lazy(() => import('./AdminApp'));

// Loading component for admin panel
const AdminLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Admin Panel</h2>
      <p className="text-gray-500">Please wait while we load the admin interface...</p>
    </div>
  </div>
);

function App() {
  return (
    <CustomerAuthProvider>
      <SupabaseProductProvider>
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

                  {/* Admin Routes - Code Split */}
                  <Route path="/admin/*" element={
                    <Suspense fallback={<AdminLoadingFallback />}>
                      <AdminApp />
                    </Suspense>
                  } />
                </Routes>
                
                {/* Debug component for development */}
                <CustomerAuthDebug />
              </Router>
            </CartProvider>
          </OrderProvider>
        </PaymentProvider>
      </SupabaseProductProvider>
    </CustomerAuthProvider>
  );
}

export default App; 