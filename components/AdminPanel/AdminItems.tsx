'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import useItemsStore from '@/store/useItemStore';
import CreateItemModal from "./AdminItemModal";
import useAdminStore from "@/store/useAdminStore";
import ItemCard from '../ItemCard';
import { Item } from '@/store/useItemStore/types';

const AdminPanel = () => {
	const { items, deleteItem, fetchItems } = useItemsStore();
	const { openModal, closeModal, setCurrentItem, fetchCategories } = useAdminStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredItems, setFilteredItems] = useState(items);

	useEffect(() => {
		const fetchData = async () => {
			await fetchItems();
			await fetchCategories();
		};
		fetchData();
	}, [fetchItems, fetchCategories]);

	useEffect(() => {
		setFilteredItems(
			items.filter((item) =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [items, searchQuery]);

	const handleEdit = (item: Item | null) => {
		setCurrentItem(item);
		openModal();
	};

	return (
		<div>
			<div className='flex flex-col max-w-6xl mx-auto'>
				<div className="flex justify-between my-5 px-8 w-full">
					<h2 className="text-2xl font-bold">Панель администратора</h2>
					<div className="flex gap-4">
						<Input
							variant="bordered"
							fullWidth
							placeholder="Поиск товаров по имени..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-72"
						/>
						<Button className="bg-primary-color text-light-white-color" onPress={() => { openModal(); setCurrentItem(null); }}>
							Добавить товар
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-4 gap-2 mt-6">
					{filteredItems.map((item) => (
						<ItemCard
							key={item.id}
							item={item}
							isAdmin={true}
							onEdit={handleEdit}
							onDelete={deleteItem}
						/>
					))}
				</div>

				<CreateItemModal onClose={closeModal} />
			</div>
		</div>
	);
};

export default AdminPanel;