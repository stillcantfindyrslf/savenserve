import { create } from 'zustand';
import { fetchCategories } from '@/api/categories';

export type Category = {
	id: number;
	name: string;
	description: string | null;
};

type CategoryState = {
	categories: Category[];
	isLoaded: boolean;
	isLoading: boolean;
	fetchCategories: () => Promise<void>;
	clearCategories: () => void;
};

export const useCategoriesStore = create<CategoryState>((set, get) => ({
	categories: [],
	isLoaded: false,
	isLoading: false,

	fetchCategories: async () => {
		const { isLoaded, isLoading } = get();

		if (isLoaded || isLoading) return;

		set({ isLoading: true });

		try {
			const categories = await fetchCategories();
			set({ categories, isLoaded: true, isLoading: false });
		} catch (err) {
			console.error('Ошибка при загрузке категорий:', err);
			set({ isLoading: false });
		}
	},

	clearCategories: () => {
		set({ categories: [], isLoaded: false });
	},
}));