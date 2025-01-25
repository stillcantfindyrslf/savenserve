import React, {FC} from 'react';
import ItemCard from './ItemCard';
import {Item, useItemsStore} from "@/store/useItemStore/useItemStore";
import {Spinner} from "@nextui-org/react";

interface ItemCardProps {
	items: Item[];
}

const ItemsList: FC<ItemCardProps> = ({ items }) => {
	const { isLoading } = useItemsStore();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center mt-32">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="mt-32 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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