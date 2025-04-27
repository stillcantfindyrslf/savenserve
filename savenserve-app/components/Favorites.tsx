'use client';

import React, { useEffect } from 'react';

import ItemCard from '@/components/ItemCard';
import useLikeStore from "@/store/useLikesStote";
import useItemsStore from "@/store/useItemStore";
import useAuthStore from "@/store/useAuthStore";
import { Spinner } from "@nextui-org/react";
import FloatingNavbar from '@/components/FloatingNavbar';

const Favorites: React.FC = () => {
	const { likedItems, isLoading, fetchLikedItems } = useLikeStore();
	const { items, fetchItems } = useItemsStore();
	const { user } = useAuthStore();
	const [searchQuery, setSearchQuery] = React.useState("");

	useEffect(() => {
		fetchItems();

		if (user) {
				fetchLikedItems(user.id);
		}
}, [fetchItems, fetchLikedItems, user]);

	const favoriteItems = items.filter((item) => likedItems.includes(item.id));

    const filteredItems = favoriteItems.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" color="success" />
            </div>
        );
    }

	return (
		<>
		<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
		<div className="max-w-6xl mx-auto p-4 mt-32">
				<h1 className="text-3xl font-bold mb-6">Понравившиеся товары</h1>
				{filteredItems.length === 0 ? (
						<p className="text-lg text-gray-600">
								{searchQuery ? "Ничего не найдено." : "Вы ещё не добавили товары в понравившиеся."}
						</p>
				) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{filteredItems.map((item) => (
										<ItemCard key={item.id} item={item} />
								))}
						</div>
				)}
		</div>
</>
	);
};

export default Favorites;