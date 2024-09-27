import { create } from 'zustand';

const useNotificationStore = create((set) => ({
    notifications: [],

    addNotification: (message, type = 'info') => {
        const id = Date.now();
        const newNotification = { id, message, type };
        set((state) => ({ notifications: [...state.notifications, newNotification] }));
        setTimeout(() => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })), 5000);
    },

    removeNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
}));

export default useNotificationStore;
