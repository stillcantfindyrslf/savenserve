import { create } from "zustand";
import {addLike, getLikedItems, removeLike} from "@/api/likes";

interface LikeState {
	likedItems: number[]; // Список ID лайкнутых товаров
	isLoading: boolean;
	error: string | null;

	fetchLikedItems: (userId: string) => Promise<void>;
	toggleLike: (userId: string, itemId: number) => Promise<void>;
	isLiked: (itemId: number) => boolean;
}

export const useLikeStore = create<LikeState>((set, get) => ({
	likedItems: [],
	isLoading: false,
	error: null,

	fetchLikedItems: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const likedItems = await getLikedItems(userId);
			set({ likedItems: [...new Set(likedItems)], isLoading: false }); // Убираем дубли
		} catch (error) {
			set({ error: 'Ошибка при загрузке лайков', isLoading: false });
		}
	},

	toggleLike: async (userId: string, itemId: number) => {
		const { likedItems } = get();
		try {
			if (likedItems.includes(itemId)) {
				await removeLike(userId, itemId);
				set({ likedItems: likedItems.filter((id) => id !== itemId) });
			} else {
				await addLike(userId, itemId);
				set({ likedItems: [...likedItems, itemId] });
			}
		} catch (error) {
			set({ error: 'Ошибка при переключении лайка' });
		}
	},

	isLiked: (itemId: number) => {
		const { likedItems } = get();
		return likedItems.includes(itemId);
	},
}));