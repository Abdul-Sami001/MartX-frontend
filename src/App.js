import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import useAuthStore from './stores/authStore';  // Import Zustand store
import axios from 'axios';  
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LogoutButton from './components/LogoutButton';
import Dashboard from './pages/Dashboard';
import ImageUpload from './components/Image';
import ProductPage from './pages/ProductDetailpage';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentComponent from './components/PaymentComponent';

const stripePromise = loadStripe('pk_test_51PsV1D03pR92vHPUx85GxUuipVPCfKAjxsboQbvefxLLoZFQUC0Ec6xD0P99uWJth7pW2SHuGQCCzT7sq2sA9azK00Au7Rxijd');

function App() {
  const { isAuthenticated, fetchUserInfo } = useAuthStore();  // Access Zustand actions

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo(); // Fetch user info after authentication
    }
  }, [isAuthenticated, fetchUserInfo]);
  
  return (
    <>
      <Elements stripe={stripePromise}>
    <Router>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/product/:id" element={<ProductPage />} />  {/* Dynamic route */}
          <Route path="/seller" element={<Dashboard />} />
          <Route path="/image" element={<ImageUpload />} />
          <Route path="/logout" element={<LogoutButton />} />
        {/* Other routes go here */}
      </Routes>
    </Router>
      </Elements>
    </>
  );
}

export default App;
