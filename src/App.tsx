import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { SupabaseProductProvider } from './context/SupabaseProductContext';
import { CartProvider } from './context/CartContext';
import { PaymentProvider } from './context/PaymentContext';
import { SupabaseOrderProvider } from './context/SupabaseOrderContext';

// Layout and Pages
import Layout from './components/common/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

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
    <SupabaseProductProvider>
      <PaymentProvider>
        <SupabaseOrderProvider>
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
                </Route>

                {/* Redirect old customer order routes to home */}
                <Route path="/orders" element={<Navigate to="/" replace />} />
                <Route path="/order/:orderId" element={<Navigate to="/" replace />} />

                {/* Admin Routes - Code Split */}
                <Route path="/admin/*" element={
                  <Suspense fallback={<AdminLoadingFallback />}>
                    <AdminApp />
                  </Suspense>
                } />

                {/* Catch-all route for 404s - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </SupabaseOrderProvider>
      </PaymentProvider>
    </SupabaseProductProvider>
  );
}

export default App;
