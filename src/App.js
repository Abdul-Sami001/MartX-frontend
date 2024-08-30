import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LogoutButton from './components/LogoutButton';
import Dashboard from './pages/Dashboard';
import ImageUpload from './components/Image';
import Cart from './components/Cart';
function App() {

  const [cart, setCart] = useState(null); // Holds cart details including id
  const [cartItems, setCartItems] = useState([]); // Holds the list of items in the cart
  const [loading, setLoading] = useState(true);

  // Step 1: Initialize or Retrieve the Cart
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const savedCartId = localStorage.getItem('cartId');

        if (savedCartId) {
          // Retrieve the existing cart using the ID from localStorage
          const { data: cartDetails } = await axios.get(`http://127.0.0.1:8000/store/carts/${savedCartId}/`);
          setCart(cartDetails);
          setCartItems(cartDetails.items);
        } else {
          // Create a new cart if none exists
          const { data: newCart } = await axios.post('http://127.0.0.1:8000/store/carts/');
          setCart(newCart);
          localStorage.setItem('cartId', newCart.id);
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        localStorage.removeItem('cartId'); // Clear the cartId if there's an error
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, []);

  // Step 2: Add Item to Cart
  const addToCart = async (product) => {
    if (!cart) return;

    try {
      const existingItem = cartItems.find(item => item.product.id === product.id);
      if (existingItem) {
        // Update quantity if item already exists
        const { data: updatedItem } = await axios.patch(`http://127.0.0.1:8000/store/carts/${cart.id}/items/${existingItem.id}/`, {
          quantity: existingItem.quantity + 1,
        });
        setCartItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
      } else {
        // Add new item
        const { data: newItem } = await axios.post(`http://127.0.0.1:8000/store/carts/${cart.id}/items/`, {
          product: product.id,
          quantity: 1,
        });
        setCartItems([...cartItems, newItem]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Step 3: Remove Item from Cart
  const removeFromCart = async (itemId) => {
    if (!cart) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/store/carts/${cart.id}/items/${itemId}/`);
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <>
    <Router>
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/seller" element={<Dashboard />} />
          <Route path="/image" element={<ImageUpload />} />
        {/* Other routes go here */}
      </Routes>
    </Router>
      <LogoutButton />
    </>
  );
}

export default App;
