'use client';

import React, { useEffect } from 'react';
import useItemsStore from './useItemStore';
import { useLikeStore } from '@/store/useLikesStore';
import useAuthStore from '@/store/useAuthStore';
import {useCategoriesStore} from "@/store/useCategoriesStore";

const StoreInitializer: React.FC = () => {
	const { user } = useAuthStore();
	const { fetchItems, items } = useItemsStore();
	const { fetchLikedItems } = useLikeStore();
	const { fetchCategories } = useCategoriesStore();

	useEffect(() => {
		if (!items.length) {
			fetchItems();
		}
		if (user) {
			fetchLikedItems(user.id);
		}
		fetchCategories();
	}, [user, items.length, fetchItems, fetchLikedItems, fetchCategories]);

	return null;
};

export default StoreInitializer;