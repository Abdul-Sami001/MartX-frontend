import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import FeaturedCategories from '../components/FeaturedCategories';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import Testimonials from '../components/Testimonials';
import Cart from '../components/Cart';
import { fetchCart, createCart } from '../services/productService';
import ProductListing from '../components/ProductListing';
import PromotionalBanner from '../components/PromotionalBanner';
import NewsletterSignup from '../components/NewsletterSignup';

const DashboardPage = () => {
    const [cartId, setCartId] = useState(null);
    const [cart, setCart] = useState(null);

    useEffect(() => {
        const initializeCart = async () => {
            let storedCartId = localStorage.getItem('cartId');
            if (!storedCartId) {
                try {
                    const newCart = await createCart();
                    storedCartId = newCart.id;
                    localStorage.setItem('cartId', storedCartId);
                } catch (error) {
                    console.error('Failed to create a new cart:', error);
                    return;
                }
            }
            setCartId(storedCartId);
            const cartData = await fetchCart(storedCartId);
            setCart(cartData);
        };

        initializeCart();
    }, []);

    const handleUpdateCart = (updatedCart) => {
        setCart(updatedCart);
    };

    if (!cartId) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <Banner />
            <FeaturedCategories />
            <ProductListing />
            <PromotionalBanner />
            <Testimonials />
            <ProductList cartId={cartId} onUpdateCart={handleUpdateCart} />
            <Cart cartId={cartId} cart={cart} onUpdateCart={handleUpdateCart} />
            <NewsletterSignup />
            <Footer />
        </>
    );
};

export default DashboardPage;
