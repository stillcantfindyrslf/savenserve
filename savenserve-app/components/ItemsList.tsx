import React, {FC} from 'react';
import ItemCard from './ItemCard';
import useItemsStore from "@/store/useItemStore";
import { Item } from '@/store/useItemStore/types';
import {Spinner} from "@nextui-org/react";

interface ItemCardProps {
	items: Item[];
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
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
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