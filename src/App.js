import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  // Ensure correct import
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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

const stripePromise = loadStripe('pk_test_51PsV1D03pR92vHPUx85GxUuipVPCfKAjxsboQbvefxLLoZFQUC0Ec6xD0P99uWJth7pW2SHuGQCCzT7sq2sA9azK00Au7Rxijd');

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/product/:id" element={<ProductPage />} />  {/* Dynamic route */}
            <Route path="/checkout/:orderId" element={<CheckoutPage />} />
            <Route path="/checkout/" element={<CheckoutPage />} />
            <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/guest-order-confirmation/:orderId" element={<GuestOrderView />} />
            <Route path="/seller" element={<Dashboard />} />
            <Route path="/image" element={<ImageUpload />} />
            <Route path="/logout" element={<LogoutButton />} />
          </Routes>
        </Router>
      </Elements>
    </QueryClientProvider>
  );
}

export default App;
