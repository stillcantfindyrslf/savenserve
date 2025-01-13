import React, {FC, useEffect} from 'react';
import { Spinner } from '@nextui-org/react';
import ItemCard from './ItemCard';
import {Item, useItemsStore} from "@/store/useItemStore/useItemStore";

interface ItemCardProps {
	items: Item[];
}

const ItemsList: FC<ItemCardProps> = ({ items }) => {
	return (
		<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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