import React from 'react';
import { useParams } from 'react-router-dom';
import ProductListing from './ProductListing';

const VendorProductsPage = () => {
    const { vendorId } = useParams();  // Get vendor ID from the URL
    return <ProductListing vendorId={vendorId} />;  // Pass vendorId to ProductListing
};

export default VendorProductsPage;