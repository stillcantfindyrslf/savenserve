'use client';

import React, {useEffect, useState} from 'react';
import {Button, Input} from '@nextui-org/react';
import useItemsStore  from '@/store/useItemStore';
import CreateItemModal from "./AdminItemModal";
import useAdminStore from "@/store/useAdminStore";

const AdminPanel = () => {
	const { items, deleteItem } = useItemsStore();
	const { openModal, closeModal, currentItem, setCurrentItem } = useAdminStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredItems, setFilteredItems] = useState(items);

	useEffect(() => {
		setFilteredItems(
			items.filter((item) =>
				item.name.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [items, searchQuery]);

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

				<div className="grid grid-cols-4 gap-6 mt-6">
					{filteredItems.map((item) => (
						<div
							key={item.id}
							className="max-w-72 p-3 bg-white rounded-xl shadow-md flex flex-col justify-between"
						>
							{item.image && (
								<img
									src={item.image}
									alt={item.name}
									className="w-full h-auto object-cover rounded-md"
								/>
							)}
							<div className="flex flex-col items-center mt-4 space-y-2 text-center">
								<h3 className="font-semibold text-lg">{item.name}</h3>
								<p className="text-gray-600 line-clamp-4">{item.description}</p>
								<p className="text-gray-600">Адрес: {item.address || 'Не указано'}</p>
								<p className="text-gray-600">Срок годности: {item.best_before || 'Не указано'}</p>
								<p className="text-gray-600">Бренд: {item.brand || 'Не указано'}</p>
								<p className="text-gray-600">Страна: {item.country_of_origin || 'Не указано'}</p>
								<p className="text-lg font-bold text-primary-color">{item.price} р.</p>
							</div>
							<div className="flex gap-4 mt-4">
								<Button
									className="w-full bg-light-secondary-color px-8"
									onPress={() => {
										setCurrentItem(item);
										openModal();
									}}
								>
									Редактировать
								</Button>
								<Button
									className="w-full bg-red-500 text-white px-0"
									onPress={() => deleteItem(item.id)}
								>
									Удалить
								</Button>
							</div>
						</div>
					))}
				</div>

				<CreateItemModal onClose={closeModal} />
		</div>
		</div>
	);
};

export default AdminPanel;