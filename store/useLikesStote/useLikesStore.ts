import { LikeState } from './types';
import { create } from 'zustand';
import { addLike, getLikedItems, removeLike } from '@/api/likes';

const useLikeStore = create<LikeState>((set, get) => ({
	likedItems: [],
	isLoading: false,
	isLoaded: false,
	error: null,

	fetchLikedItems: async (userId: string) => {
		const { isLoaded } = get();
		if (isLoaded) return;

		try {
			const likedItems = await getLikedItems(userId);
			set({ likedItems: [...new Set(likedItems)], isLoaded: true });
		} catch (err) {
			console.error('Ошибка при загрузке лайков:', err);
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
			console.error('Ошибка при переключении лайка', error);
		}
	},

	isLiked: (itemId: number) => {
		return get().likedItems.includes(itemId);
	},
}));

export default useLikeStore;