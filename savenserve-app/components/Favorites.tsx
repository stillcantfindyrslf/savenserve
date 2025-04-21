'use client';

import React from 'react';
import ItemCard from '@/components/ItemCard';
import useLikeStore from "@/store/useLikesStote";
import useItemsStore from "@/store/useItemStore";
const Favorites: React.FC = () => {
	const { likedItems, isLoading } = useLikeStore();
	const { items } = useItemsStore();

	const favoriteItems = items.filter((item) => likedItems.includes(item.id));

	if (isLoading) {
		return <div>Загрузка...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Понравившиеся товары</h1>
			{favoriteItems.length === 0 ? (
				<p className="text-lg text-gray-600">Вы ещё не добавили товары в понравившиеся.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{favoriteItems.map((item) => (
						<ItemCard key={item.id} item={item} />
					))}
				</div>
			)}
		</div>
	);
};

export default Favorites;