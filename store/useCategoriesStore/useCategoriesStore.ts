import { CategoryState } from './types';
import { create } from 'zustand';
import { 
    fetchCategories as apiFetchCategories, 
    createCategory as apiCreateCategory,
    updateCategory as apiUpdateCategory,
    deleteCategory as apiDeleteCategory,
    createSubcategory as apiCreateSubcategory,
    updateSubcategory as apiUpdateSubcategory,
    deleteSubcategory as apiDeleteSubcategory
} from '@/api/categories';

const useCategoriesStore = create<CategoryState>((set, get) => ({
	categories: [],
	isLoaded: false,
	isLoading: false,
	selectedCategory: null,

	isCategoryModalOpen: false,
	isSubcategoryModalOpen: false,
	currentCategory: null,
	currentSubcategory: null,

	fetchCategories: async () => {
		const { isLoaded, isLoading } = get();

		if (isLoaded || isLoading) return;

		set({ isLoading: true });

		try {
			const categories = await apiFetchCategories();
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

	openCategoryModal: () => set({ isCategoryModalOpen: true }),
	closeCategoryModal: () => set({ isCategoryModalOpen: false, currentCategory: null }),
	openSubcategoryModal: (categoryId?: number) => {
		if (categoryId) {
			set(state => ({
				isSubcategoryModalOpen: true,
				currentSubcategory: { ...state.currentSubcategory, category_id: categoryId } as any
			}));
		} else {
			set({ isSubcategoryModalOpen: true });
		}
	},
	closeSubcategoryModal: () => set({ isSubcategoryModalOpen: false, currentSubcategory: null }),

	setCurrentCategory: (category) => set({ currentCategory: category }),
	setCurrentSubcategory: (subcategory) => set({ currentSubcategory: subcategory }),

	// CRUD операции
	createCategory: async (category) => {
		try {
			const newCategory = await apiCreateCategory(category);
			set(state => ({
				categories: [...state.categories, newCategory]
			}));
			return newCategory;
		} catch (error) {
			console.error('Ошибка при создании категории:', error);
			throw error;
		}
	},

	updateCategory: async (id, category) => {
		try {
			const updatedCategory = await apiUpdateCategory(id, category);
			set(state => ({
				categories: state.categories.map(cat =>
					cat.id === id ? { ...updatedCategory, subcategories: cat.subcategories } : cat
				)
			}));
			return updatedCategory;
		} catch (error) {
			console.error('Ошибка при обновлении категории:', error);
			throw error;
		}
	},

	deleteCategory: async (id) => {
		try {
			await apiDeleteCategory(id);
			set(state => ({
				categories: state.categories.filter(cat => cat.id !== id)
			}));
		} catch (error) {
			console.error('Ошибка при удалении категории:', error);
			throw error;
		}
	},

	createSubcategory: async (subcategory) => {
		try {
			const newSubcategory = await apiCreateSubcategory(subcategory);
			set(state => {
				const updatedCategories = state.categories.map(cat =>
					cat.id === subcategory.category_id
						? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
						: cat
				);
				return { categories: updatedCategories };
			});
			return newSubcategory;
		} catch (error) {
			console.error('Ошибка при создании подкатегории:', error);
			throw error;
		}
	},

	updateSubcategory: async (id, subcategory) => {
		try {
			const updatedSubcategory = await apiUpdateSubcategory(id, subcategory);
			set(state => {
				const updatedCategories = state.categories.map(cat => {
					// Если подкатегория меняет родительскую категорию
					if (subcategory.category_id && cat.id === subcategory.category_id) {
						// Если это новая родительская категория
						if (!cat.subcategories.some(sub => sub.id === id)) {
							return {
								...cat,
								subcategories: [...cat.subcategories, updatedSubcategory]
							};
						}
						// Если это текущая родительская категория, обновляем подкатегорию
						return {
							...cat,
							subcategories: cat.subcategories.map(sub =>
								sub.id === id ? updatedSubcategory : sub
							)
						};
					}
					// Удаляем подкатегорию из старой родительской категории, если она была перемещена
					else if (cat.subcategories.some(sub => sub.id === id) &&
						subcategory.category_id &&
						subcategory.category_id !== cat.id) {
						return {
							...cat,
							subcategories: cat.subcategories.filter(sub => sub.id !== id)
						};
					}
					return cat;
				});
				return { categories: updatedCategories };
			});
			return updatedSubcategory;
		} catch (error) {
			console.error('Ошибка при обновлении подкатегории:', error);
			throw error;
		}
	},

	deleteSubcategory: async (id) => {
		try {
			await apiDeleteSubcategory(id);
			set(state => {
				const updatedCategories = state.categories.map(cat => ({
					...cat,
					subcategories: cat.subcategories.filter(sub => sub.id !== id)
				}));
				return { categories: updatedCategories };
			});
		} catch (error) {
			console.error('Ошибка при удалении подкатегории:', error);
			throw error;
		}
	},
}));

export default useCategoriesStore;