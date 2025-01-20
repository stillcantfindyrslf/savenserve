import { create } from 'zustand';
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
		} catch (err) {
			console.error(err);
		}
	},

	createItem: async (payload) => {
		try {
			const newItem = await createItem(payload);
			set((state) => ({ items: [newItem, ...state.items] }));
		} catch (err) {
			console.error(err);
		}
	},

	updateItem: async (id, updatedData) => {
		try {
			const updatedItem = await updateItemById({ id, ...updatedData });
			set((state) => ({
				items: state.items.map((item) => (item.id === id ? updatedItem : item)),
			}));
		} catch (err) {
			console.error(err);
		}
	},

	deleteItem: async (id) => {
		try {
			await deleteItemById(id);
			set((state) => ({
				items: state.items.filter((item) => item.id !== id),
			}));
		} catch (err) {
			console.error(err);
		}
	},

	clearItems: () => {
		set({ items: [] });
	},
}));