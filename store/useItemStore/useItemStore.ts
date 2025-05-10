import { create } from 'zustand';
import {
	fetchItems,
	createItem as apiCreateItem,
	updateItemById,
	deleteItemById,
	uploadItemImages,
	deleteItemImage,
	fetchItemImages as apiFetchItemImages,
} from '@/api/items';
import { Item, ItemState, ItemImage, ItemWithImages } from './types';

const useItemsStore = create<ItemState>((set, get) => ({
	items: [],
	isLoaded: false,
	isLoading: false,

	fetchItems: async () => {
		const { isLoaded, isLoading } = get();

		if (isLoaded || isLoading) return;

		set({ isLoading: true });

		try {
			const items: ItemWithImages[] = await fetchItems();
			set({ items, isLoaded: true, isLoading: false });
		} catch (err) {
			console.error('Ошибка при загрузке товаров:', err);
			set({ isLoading: false });
		}
	},

	createItem: async (payload) => {
		try {
			const apiPayload = {
				category_id: payload.category_id ?? 0,
				subcategory_id: payload.subcategory_id ?? null,
				name: payload.name ?? '',
				description: payload.description ?? null,
				price: payload.price ?? 0,
				discount_price: payload.discount_price ?? 0,
				address: payload.address ?? null,
				best_before: payload.best_before ?? null,
				brand: payload.brand ?? null,
				country_of_origin: payload.country_of_origin ?? null,
				information: payload.information ?? null,
				normal_price: payload.normal_price ?? null,
				price_per_kg: payload.price_per_kg ?? null,
				weight: payload.weight ?? null,
				quantity: payload.quantity ?? 0,
				auto_discount: payload.auto_discount ?? false,
				custom_discounts: payload.custom_discounts
			};
			const newItem = await apiCreateItem(apiPayload);
			if (newItem) {
				const newItemWithImages: ItemWithImages = {
					...newItem,
					item_images: []
				};

				set((state) => ({
					items: [newItemWithImages, ...state.items]
				}));

				return newItem;
			}
			return null;
		} catch (err) {
			console.error('Ошибка при создании товара:', err);
			return null;
		}
	},

	updateItem: async (id: number, updatedData: Partial<Item>) => {
		try {
			const processedData = {
				id,
				subcategory_id: updatedData.subcategory_id ?? null,
				category_id: updatedData.category_id ?? 0,
				name: updatedData.name ?? '',
				description: updatedData.description ?? null,
				price: updatedData.price ?? 0,
				address: updatedData.address ?? '',
				quantity: updatedData.quantity ?? 0,
				best_before: updatedData.best_before ?? null,
				brand: updatedData.brand ?? null,
				country_of_origin: updatedData.country_of_origin ?? null,
				information: updatedData.information ?? null,
				normal_price: updatedData.normal_price ?? null,
				price_per_kg: updatedData.price_per_kg ?? null,
				weight: updatedData.weight ?? null,
				auto_discount: updatedData.auto_discount ?? false,
				custom_discounts: updatedData.custom_discounts ?? undefined,
				discount_price: updatedData.discount_price ?? null,
			};

			const updatedItem = await updateItemById(processedData);

			set((state) => ({
				items: state.items.map((item) =>
					item.id === id ? updatedItem : item
				),
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


	fetchItemImages: async (itemId) => {
		try {
			return await apiFetchItemImages(itemId);
		} catch (err) {
			console.error('Ошибка при загрузке изображений:', err);
			return [];
		}
	},

	uploadImages: async (files, itemId) => {
		try {
			const urls = await uploadItemImages(files, itemId);

			if (urls.length > 0) {
				set((state) => ({
					items: state.items.map(item => {
						if (item.id === itemId) {
							const newImages: ItemImage[] = urls.map(url => ({
								id: Date.now() + Math.floor(Math.random() * 1000),
								item_id: itemId,
								image_url: url
							}));

							return {
								...item,
								item_images: [...item.item_images, ...newImages]
							};
						}
						return item;
					})
				}));
			}

			return urls;
		} catch (err) {
			console.error('Ошибка при загрузке изображений:', err);
			return [];
		}
	},

	deleteImage: async (imageUrl: string) => {
		try {
			await deleteItemImage(imageUrl);
			set((state) => ({
				items: state.items.map(item => ({
					...item,
					item_images: item.item_images.filter(img => img.image_url !== imageUrl)
				}))
			}));
		} catch (err) {
			console.error('Ошибка при удалении изображения:', err);
		}
	},

	clearItems: () => {
		set({ items: [], isLoaded: false });
	},
}));

export default useItemsStore;