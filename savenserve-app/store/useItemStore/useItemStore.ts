import { create } from 'zustand';
import { toast } from 'sonner';
import { fetchItems, createItem, updateItemById, deleteItemById } from '@/api/items';

export type Item = {
	id: number;
	category_id: number;
	name: string;
	description: string | null;
	price: number;
	image: string | null;
};

type ItemState = {
	items: Item[];
	fetchItems: () => Promise<void>;
	createItem: (payload: Omit<Item, 'id'>) => Promise<void>;
	updateItem: (id: number, updatedData: Partial<Item>) => Promise<void>;
	deleteItem: (id: number) => Promise<void>;
	clearItems: () => void;
};

export const useItemsStore = create<ItemState>((set, get) => ({
	items: [],

	fetchItems: async () => {
		try {
			const items = await fetchItems();
			set({ items });
			toast.success('Товары успешно загружены');
		} catch (err) {
			console.error(err);
			toast.error('Ошибка загрузки товаров');
		}
	},

	createItem: async (payload) => {
		try {
			const newItem = await createItem(payload);
			set((state) => ({ items: [newItem, ...state.items] }));
			toast.success('Товар успешно создан');
		} catch (err) {
			console.error(err);
			toast.error('Ошибка создания товара');
		}
	},

	updateItem: async (id, updatedData) => {
		try {
			const updatedItem = await updateItemById({ id, ...updatedData });
			set((state) => ({
				items: state.items.map((item) => (item.id === id ? updatedItem : item)),
			}));
			toast.success('Товар успешно обновлён');
		} catch (err) {
			console.error(err);
			toast.error('Ошибка обновления товара');
		}
	},

	deleteItem: async (id) => {
		try {
			await deleteItemById(id);
			set((state) => ({
				items: state.items.filter((item) => item.id !== id),
			}));
			toast.success('Товар успешно удалён');
		} catch (err) {
			console.error(err);
			toast.error('Ошибка удаления товара');
		}
	},

	clearItems: () => {
		set({ items: [] });
		toast.info('Список товаров очищен');
	},
}));