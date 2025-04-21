import { CategoryState } from './types';
import { create } from 'zustand';
import { fetchCategories } from '@/api/categories';

const useCategoriesStore = create<CategoryState>((set, get) => ({
	categories: [],
	isLoaded: false,
	isLoading: false,
	selectedCategory: null,

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

	fetchCategoryWithSubcategories: async (urlName: string) => {
		set({ isLoading: true });

		try {
			const { categories } = get();
			if (!categories || categories.length === 0) {
				throw new Error('Категории не загружены');
			}

			const subcategory = categories
				.flatMap((category) => category.subcategories)
				.find((subcategory) => subcategory.url_name === urlName);

			if (subcategory) {
				const parentCategory = categories.find((category) => category.id === subcategory.category_id);
				if (!parentCategory) {
					throw new Error('Родительская категория не найдена');
				}
				set({ selectedCategory: parentCategory, isLoading: false });
				return;
			}

			const category = categories.find((c) => c.url_name === urlName);
			if (!category) {
				throw new Error('Категория не найдена');
			}
			set({ selectedCategory: category, isLoading: false });
		} catch (err) {
			console.error('Ошибка при загрузке категории:', err);
			set({ isLoading: false });
		}
	},

	clearCategories: () => {
		set({ categories: [], isLoaded: false, selectedCategory: null });
	},
}));

export default useCategoriesStore;