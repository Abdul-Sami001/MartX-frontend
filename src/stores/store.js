// store.js
import useCartStore from './cartStore';
import useProductStore from './productStore';
import useVendorStore from './vendorStore';

const useStore = () => ({
    ...useCartStore(),
    ...useProductStore(),
    ...useVendorStore()
});

export default useStore;
