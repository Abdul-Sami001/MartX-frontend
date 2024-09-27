import { create } from 'zustand';
import axios from 'axios';

const useReviewStore = create((set) => ({
    reviews: [],
    averageRating: 0,
    loading: false,
    error: null,

    fetchReviews: async (productId) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.get(`/store/products/${productId}/reviews`);
            set({ reviews: data, averageRating: calculateAverage(data), loading: false });
        } catch (error) {
            set({ error: 'Failed to load reviews', loading: false });
        }
    },

    addReview: async (reviewData) => {
        set({ loading: true });
        try {
            await axios.post(`/store/reviews/`, reviewData);
            set((state) => ({ reviews: [...state.reviews, reviewData], loading: false }));
        } catch (error) {
            set({ error: 'Failed to add review', loading: false });
        }
    },
}));

function calculateAverage(reviews) {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
}

export default useReviewStore;
