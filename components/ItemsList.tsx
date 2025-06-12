import React, { FC, useState, useEffect } from 'react';
import ItemCard from './ItemCard';
import useItemsStore from "@/store/useItemStore";
import { ItemWithImages } from '@/store/useItemStore/types';
import { Spinner, Pagination } from "@nextui-org/react";

interface ItemCardProps {
	items: ItemWithImages[];
	itemsPerPage?: number;
}

const ItemsList: FC<ItemCardProps> = ({ items, itemsPerPage = 20 }) => {
	const { isLoading } = useItemsStore();
	const [currentPage, setCurrentPage] = useState(1);
	const [displayedItems, setDisplayedItems] = useState<ItemWithImages[]>([]);

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const showPagination = items.length > itemsPerPage;

	useEffect(() => {
		setCurrentPage(1);
	}, [items]);

	useEffect(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		setDisplayedItems(items.slice(startIndex, endIndex));

		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentPage, items, itemsPerPage]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Spinner color="success" />
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 cards-xs:grid-cols-2 cards-sm:grid-cols-3 cards-md:grid-cols-2 cards-lg:grid-cols-3 cards-xl:grid-cols-4 gap-3">
				{displayedItems.map((item) => (
					<ItemCard
						key={item.id}
						item={item}
					/>
				))}
			</div>

			{showPagination && (
				<div className="flex justify-center mt-8">
					<Pagination
						variant="bordered"
						total={totalPages}
						initialPage={1}
						page={currentPage}
						onChange={setCurrentPage}
						color="success"
						size="lg"
						showControls
						classNames={{
							wrapper: "gap-2",
							item: "text-color-text border border-gray-200 hover:bg-gray-50",
							cursor: "bg-secondary-color text-white border border-secondary-color",
							next: "text-primary-color border border-gray-200",
							prev: "text-primary-color border border-gray-200",
							ellipsis: "text-color-text"
						}}
					/>
				</div>
			)}
		</>
	);
};

export default ItemsList;