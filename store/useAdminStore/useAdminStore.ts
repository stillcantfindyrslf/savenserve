import { create } from 'zustand';
import { AdminStoreState } from './types';
import { fetchCategories } from '@/api/categories';

const useAdminStore = create<AdminStoreState>((set) => ({
    isModalOpen: false,
    currentItem: null,
    categories: [],
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    setCurrentItem: (item) => set({ currentItem: item }),
    fetchCategories: async () => {
        try {
            const categories = await fetchCategories();
            set({ categories });
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error);
        }
    },
}));

export default useAdminStore;