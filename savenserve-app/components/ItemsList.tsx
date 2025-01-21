import React, {FC} from 'react';
import ItemCard from './ItemCard';
import {Item} from "@/store/useItemStore/useItemStore";

interface ItemCardProps {
	items: Item[];
}

const ItemsList: FC<ItemCardProps> = ({ items }) => {
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