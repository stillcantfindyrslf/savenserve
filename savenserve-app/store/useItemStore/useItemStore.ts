import { create } from 'zustand';
import { fetchItems, createItem, updateItemById, deleteItemById, uploadItemImages, deleteItemImage } from '@/api/items';
import { ItemState } from './types';

const useItemsStore = create<ItemState>((set, get) => ({
	items: [],
	isLoaded: false,
	isLoading: false,

	fetchItems: async () => {
		const { isLoaded, isLoading } = get();

		if (isLoaded || isLoading) return;

		set({ isLoading: true });

		try {
			const items = await fetchItems();
			set({ items, isLoaded: true, isLoading: false });
		} catch (err) {
			console.error('Ошибка при загрузке товаров:', err);
			set({ isLoading: false });
		}
	},

	createItem: async (payload) => {
		try {
			const newItem = await createItem(payload);
			set((state) => ({ items: [newItem, ...state.items] }));
		} catch (err) {
			console.error('Ошибка при создании товара:', err);
		}
	},

	updateItem: async (id, updatedData) => {
		try {
			const updatedItem = await updateItemById({ id, ...updatedData });
			set((state) => ({
				items: state.items.map((item) => (item.id === id ? updatedItem : item)),
			}));
		} catch (err) {
			console.error('Ошибка при обновлении товара:', err);
		}
	},

	deleteItem: async (id) => {
		try {
			await deleteItemById(id);
			set((state) => ({
				items: state.items.filter((item) => item.id !== id),
			}));
		} catch (err) {
			console.error('Ошибка при удалении товара:', err);
		}
	},

	uploadImages: async (files: File[], itemId: number): Promise<string[]> => {
		try {
			return await uploadItemImages(files, itemId);
		} catch (err) {
			console.error('Ошибка при загрузке изображений:', err);
			return [];
		}
	},

	deleteImage: async (imageUrl: string) => {
		try {
			await deleteItemImage(imageUrl);
			console.log('Изображение успешно удалено');
		} catch (err) {
			console.error('Ошибка при удалении изображения:', err);
		}
	},

	clearItems: () => {
		set({ items: [], isLoaded: false });
	},
}));

export default useItemsStore;