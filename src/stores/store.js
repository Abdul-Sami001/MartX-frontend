// store.js
import useCartStore from './cartStore';
import useProductStore from './productStore';

const useStore = () => ({
    ...useCartStore(),
    ...useProductStore()
});

export default useStore;
