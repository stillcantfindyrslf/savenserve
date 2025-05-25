import React, { FC } from 'react';
import ItemCard from './ItemCard';
import useItemsStore from "@/store/useItemStore";
import { ItemWithImages } from '@/store/useItemStore/types';
import { Spinner } from "@nextui-org/react";

interface ItemCardProps {
	items: ItemWithImages[];
}

const ItemsList: FC<ItemCardProps> = ({ items }) => {
	const { isLoading } = useItemsStore();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 cards-xs:grid-cols-2 cards-sm:grid-cols-3 cards-md:grid-cols-2 cards-lg:grid-cols-3 cards-xl:grid-cols-4 gap-3">
			{items.map((item) => (
				<ItemCard
					key={item.id}
					item={item}
				/>
			))}
		</div>
	);
};

export default ItemsList;