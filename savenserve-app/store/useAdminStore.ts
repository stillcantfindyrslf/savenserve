import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useAdminStore = create((set) => ({
	isModalOpen: false,
	currentItem: null,
	categories: [],
	openModal: () => set({ isModalOpen: true }),
	closeModal: () => set({ isModalOpen: false }),
	setCurrentItem: (item) => set({ currentItem: item }),
	fetchCategories: async () => {
		const { data, error } = await supabase.from('categories').select('id, name');
		if (error) {
			console.error('Ошибка загрузки категорий:', error);
		} else {
			set({ categories: data || [] });
		}
	},
}));
