'use client';

import React, { useEffect } from 'react';
import { useItemsStore } from '@/store/useItemStore/useItemStore';
import { useLikeStore } from '@/store/useLikesStore';
import useAuthStore from '@/store/useAuthStore';

const StoreInitializer: React.FC = () => {
	const { user } = useAuthStore();
	const { fetchItems, items } = useItemsStore();
	const { fetchLikedItems } = useLikeStore();

	useEffect(() => {
		if (!items.length) {
			fetchItems();
		}
		if (user) {
			fetchLikedItems(user.id);
		}
	}, [user]);

	return null;
};

export default StoreInitializer;