import React, { FC, useState, useEffect, useMemo } from 'react';
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

	const availableItems = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return items.filter(item => {
			const bestBefore = item.best_before ? new Date(item.best_before) : null;
			return item.quantity > 0 &&
				(!bestBefore || bestBefore >= today);
		});
	}, [items]);

	const displayedItems = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return availableItems.slice(startIndex, endIndex);
	}, [currentPage, availableItems, itemsPerPage]);

	const totalPages = Math.ceil(availableItems.length / itemsPerPage);
	const showPagination = availableItems.length > itemsPerPage;

	useEffect(() => {
		setCurrentPage(1);
	}, [items]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentPage]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Spinner color="success" />
			</div>
		);
	}

	return (
		<>
			{availableItems.length === 0 ? (
				<div className="flex justify-center items-center py-10">
					<p className="text-lg text-gray-500">Нет доступных товаров</p>
				</div>
			) : (
				<div className="grid grid-cols-1 cards-xs:grid-cols-2 cards-sm:grid-cols-3 cards-md:grid-cols-2 cards-lg:grid-cols-3 cards-xl:grid-cols-4 gap-3">
					{displayedItems.map((item) => (
						<ItemCard
							key={item.id}
							item={item}
						/>
					))}
				</div>
			)}

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