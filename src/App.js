import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // Ensure correct import
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';  // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import toastify CSS for styling
// Pages and Components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductDetailpage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import GuestOrderView from './components/GuestOrderView';
import Dashboard from './pages/Dashboard';
import ImageUpload from './components/Image';
import LogoutButton from './components/LogoutButton';
import { useCart } from './hooks/useCart';
import { initializeCart } from './services/cartService'; // Import cart initialization service
import useCartStore from './stores/cartStore'; // Zustand store for setting the cart
import GuestInfoModal from './components/GuestInfoModal';
import OrderHistory from './components/OrderHistory';
import OrderDetail from './components/OrderDetail';
import GuestOrderTracking from './components/GuestOrderTracking';
import VendorProductsPage from './components/VendorProductsPage';
import ProductListing from './components/ProductListing';


const stripePromise = loadStripe('pk_test_51PsV1D03pR92vHPUx85GxUuipVPCfKAjxsboQbvefxLLoZFQUC0Ec6xD0P99uWJth7pW2SHuGQCCzT7sq2sA9azK00Au7Rxijd');

// Create a QueryClient instance
const queryClient = new QueryClient();  // Create the QueryClient here

function App() {
  const setCart = useCartStore((state) => state.setCart);  // Zustand action to set cart in the store

  // Initialize cart when app loads
  useEffect(() => {
    const initializeAppCart = async () => {
      try {
        const { cartId, cartItems } = await initializeCart();
        setCart(cartId, cartItems);  // Set the cart details in Zustand store
      } catch (error) {
        console.error('Error initializing cart:', error);
        // Optionally, handle the error (e.g., show a toast or notification)
      }
    };

    initializeAppCart();
  }, [setCart]);

  return (
    <QueryClientProvider client={queryClient}>  {/* Wrap your app with QueryClientProvider */}
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/product/:id" element={<ProductPage />} />  {/* Dynamic route */}
            <Route path="/checkout/:orderId" element={<CheckoutPage />} />
            <Route path="/checkout/" element={<CheckoutPage />} />
            <Route path="/guest-info/" element={<GuestInfoModal />} />
            <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/guest-order-confirmation/:orderId" element={<GuestOrderView />} />
            <Route path="/seller" element={<Dashboard />} />
            <Route path="/image" element={<ImageUpload />} />
            <Route path="/logout" element={<LogoutButton />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/orders" element={<OrderHistory />} />  {/* Authenticated user order history */}
            <Route path="/orders/:orderId" element={<OrderDetail />} />  {/* Order detail page */}
            <Route path="/guest-order-tracking" element={<GuestOrderTracking />} />  {/* Guest order tracking */}
            <Route path="/vendors/:vendorId/products" element={<VendorProductsPage />} />
          </Routes>
        </Router>
      </Elements>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </QueryClientProvider>
  );
}

export default App;
