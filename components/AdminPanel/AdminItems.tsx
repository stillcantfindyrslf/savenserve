'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Spinner, Accordion, AccordionItem } from '@nextui-org/react';
import useItemsStore from '@/store/useItemStore';
import useCategoriesStore from '@/store/useCategoriesStore';
import CreateItemModal from "./Modals/AdminItemModal";
import useAdminStore from "@/store/useAdminStore";
import ItemCard from '../ItemCard';
import { ItemWithImages } from '@/store/useItemStore/types';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { BiCategory } from 'react-icons/bi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { getIconByName } from '@/utils/CategoryIcons';
import { Category, Subcategory } from '@/store/useCategoriesStore/types';

interface GroupedSubcategory {
	subcategory: Subcategory;
	items: ItemWithImages[];
}

interface GroupedCategory {
	category: Category;
	items: ItemWithImages[];
	subcategories: {
		[subcategoryId: number]: GroupedSubcategory;
	};
}

interface GroupedItems {
	[categoryId: number]: GroupedCategory;
}

const AdminItems = () => {
	const { items, deleteItem, fetchItems, isLoading } = useItemsStore();
	const { categories, fetchCategories } = useCategoriesStore();
	const { openModal, closeModal, setCurrentItem } = useAdminStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredItems, setFilteredItems] = useState<ItemWithImages[]>([]);
	const [uncategorizedItems, setUncategorizedItems] = useState<ItemWithImages[]>([]);
	const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(["all"]));
	const [groupedItems, setGroupedItems] = useState<GroupedItems>({});

	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([fetchItems(), fetchCategories()]);
		};
		fetchData();
	}, [fetchItems, fetchCategories]);

	useEffect(() => {
		if (items.length && categories.length) {
			const itemsToFilter = searchQuery
				? items.filter(item =>
					item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					item.description?.toLowerCase().includes(searchQuery.toLowerCase())
				)
				: items;

			const grouped: GroupedItems = {};
			const uncategorized: ItemWithImages[] = [];

			itemsToFilter.forEach(item => {
				if (!item.category_id) {
					uncategorized.push(item);
					return;
				}

				if (!grouped[item.category_id]) {
					const category = categories.find(c => c.id === item.category_id);
					if (!category) {
						uncategorized.push(item);
						return;
					}

					grouped[item.category_id] = {
						category,
						items: [],
						subcategories: {}
					};
				}

				if (item.subcategory_id) {
					if (!grouped[item.category_id].subcategories[item.subcategory_id]) {
						const subcategory = grouped[item.category_id].category.subcategories.find(
							(s: Subcategory) => s.id === item.subcategory_id
						);

						if (subcategory) {
							grouped[item.category_id].subcategories[item.subcategory_id] = {
								subcategory,
								items: []
							};
						} else {
							grouped[item.category_id].items.push(item);
							return;
						}
					}

					grouped[item.category_id].subcategories[item.subcategory_id].items.push(item);
				} else {
					grouped[item.category_id].items.push(item);
				}
			});

			setGroupedItems(grouped);
			setUncategorizedItems(uncategorized);
			setFilteredItems(itemsToFilter);
		}
	}, [items, categories, searchQuery]);

	const handleEdit = (item: ItemWithImages) => {
		setCurrentItem(item);
		openModal();
	};

	const handleAddItem = (categoryId?: number, subcategoryId?: number) => {
		setCurrentItem({
			category_id: categoryId || null,
			subcategory_id: subcategoryId || null
		} as ItemWithImages);
		openModal();
	};

	const toggleAccordion = (key: string) => {
		setExpandedKeys(prev => {
			const newSet = new Set(prev);
			if (newSet.has(key)) {
				newSet.delete(key);
			} else {
				newSet.add(key);
			}
			return newSet;
		});
	};

	const isExpanded = (key: string) => expandedKeys.has(key);

	const getCategoryItemCount = (categoryId: number) => {
		if (!groupedItems[categoryId]) return 0;

		let count = groupedItems[categoryId].items.length;

		Object.values(groupedItems[categoryId].subcategories).forEach(sub => {
			count += sub.items.length;
		});

		return count;
	};

	return (
		<div className="py-4">
			<div className="flex flex-col">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 lg:px-5 mb-6">
					<h1 className="text-2xl font-bold text-color-text">Управление товарами</h1>

					<div className="flex flex-col sm:flex-row w-full sm:w-auto">
						<Input
							variant="bordered"
							placeholder="Поиск товаров..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							classNames={{
								base: "min-w-80 sm:max-w-xs",
								inputWrapper: "border-gray-200 bg-white rounded-xl"
							}}
							startContent={<FiSearch className="text-primary-color" />}
						/>
					</div>
				</div>

				{isLoading ? (
					<div className="flex justify-center py-20">
						<Spinner color="success" size="lg" />
					</div>
				) : filteredItems.length > 0 ? (
					<div className="space-y-4">
						<Accordion
							className="px-0"
							selectedKeys={isExpanded("all") ? ["all"] : []}
							onSelectionChange={() => toggleAccordion("all")}
							variant="bordered"
							selectionMode="single"
						>
							<AccordionItem
								key="all"
								aria-label="Все товары"
								classNames={{
									base: "rounded-xl shadow-none px-0",
									trigger: "px-6 py-4",
									content: "pt-0 pb-4",
								}}
								indicator={
									<div className={`text-primary-color transition-transform ${isExpanded("all") ? "rotate-180" : ""}`}>
										<MdKeyboardArrowDown size={24} />
									</div>
								}
								title={
									<div className="flex items-center gap-2">
										<BiCategory className="text-primary-color text-xl" />
										<span className="font-semibold">Все товары</span>
										<span className="text-gray-600 text-sm ml-2">({filteredItems.length})</span>
										<Button
											size="sm"
											variant="flat"
											className="ml-auto h-8 min-w-0 bg-light-secondary-color text-primary-color border border-primary-color/20"
											onClick={(e) => {
												e.stopPropagation();
												handleAddItem();
											}}
										>
											<FiPlus size={16} />
											<span className="sm:inline hidden">
												Добавить товар
											</span>
										</Button>
									</div>
								}
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 gap-4 pt-4">
									{filteredItems.map((item) => (
										<ItemCard
											key={item.id}
											item={item}
											isAdmin={true}
											onEdit={() => handleEdit(item)}
											onDelete={deleteItem}
										/>
									))}
								</div>
							</AccordionItem>
						</Accordion>

						{Object.entries(groupedItems).map(([categoryId, { category, items, subcategories }]) => (
							<Accordion
								key={categoryId}
								className="px-0"
								variant="bordered"
								selectedKeys={isExpanded(categoryId) ? [categoryId] : []}
								onSelectionChange={() => toggleAccordion(categoryId)}
							>
								<AccordionItem
									key={categoryId}
									aria-label={category.name}
									classNames={{
										base: "rounded-xl shadow-none",
										trigger: "px-6 py-4",
										content: "px-6 pt-0 pb-4",
									}}
									indicator={
										<div className={`text-primary-color transition-transform ${isExpanded(categoryId) ? "rotate-180" : ""}`}>
											<MdKeyboardArrowDown size={24} />
										</div>
									}
									title={
										<div className="flex items-center gap-2">
											<span className="text-primary-color text-xl">
												{getIconByName(category.icon_name) || <BiCategory />}
											</span>
											<span className="font-semibold">{category.name}</span>
											<span className="text-gray-600 text-sm ml-2">
												({getCategoryItemCount(Number(categoryId))})
											</span>

											<Button
												size="sm"
												variant="flat"
												className="ml-auto h-8 min-w-0 bg-light-secondary-color text-primary-color border border-primary-color/20"
												onClick={(e) => {
													e.stopPropagation();
													handleAddItem(Number(categoryId));
												}}
											>
												<FiPlus size={16} />
												<span className="sm:inline hidden">
													Добавить товар
												</span>
											</Button>
										</div>
									}
								>
									<div className="space-y-6 pt-4">
										{items.length > 0 && (
											<div>
												<p className="text-sm text-gray-600 mb-3 font-medium">Без подкатегории:</p>
												<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
													{items.map((item: ItemWithImages) => (
														<ItemCard
															key={item.id}
															item={item}
															isAdmin={true}
															onEdit={() => handleEdit(item)}
															onDelete={deleteItem}
														/>
													))}
												</div>
											</div>
										)}

										{Object.entries(subcategories).map(([subcategoryId, subData]) => {
											const { subcategory, items } = subData as GroupedSubcategory;
											return (
												<div key={subcategoryId} className="pt-2">
													<div className="flex items-center mb-3">
														<h3 className="text-md font-medium text-gray-700">{subcategory.name}</h3>
														<span className="text-gray-600 text-sm ml-2">({items.length})</span>
													</div>

													<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
														{items.map((item: ItemWithImages) => (
															<ItemCard
																key={item.id}
																item={item}
																isAdmin={true}
																onEdit={() => handleEdit(item)}
																onDelete={deleteItem}
															/>
														))}
													</div>
												</div>
											);
										})}
									</div>
								</AccordionItem>
							</Accordion>
						))}

						{uncategorizedItems.length > 0 && (
							<Accordion
								className="px-0"
								variant="light"
								selectedKeys={isExpanded("uncategorized") ? ["uncategorized"] : []}
								onSelectionChange={() => toggleAccordion("uncategorized")}
								hideIndicator
								selectionMode="single"
							>
								<AccordionItem
									key="uncategorized"
									aria-label="Без категории"
									classNames={{
										base: "bg-light-secondary-color rounded-xl mb-4 shadow-none",
										trigger: "px-6 py-4",
										content: "px-6 pt-0 pb-4",
									}}
									indicator={
										<div className={`text-primary-color transition-transform ${isExpanded("uncategorized") ? "rotate-180" : ""}`}>
											<MdKeyboardArrowDown size={24} />
										</div>
									}
									title={
										<div className="flex items-center gap-2">
											<BiCategory className="text-gray-400 text-xl" />
											<span className="font-semibold">Без категории</span>
											<span className="text-gray-600 text-sm ml-2">({uncategorizedItems.length})</span>
										</div>
									}
								>
									<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
										{uncategorizedItems.map((item) => (
											<ItemCard
												key={item.id}
												item={item}
												isAdmin={true}
												onEdit={() => handleEdit(item)}
												onDelete={deleteItem}
											/>
										))}
									</div>
								</AccordionItem>
							</Accordion>
						)}
					</div>
				) : (
					<div className="text-center py-16 bg-light-secondary-color rounded-xl">
						<div className="mb-4 text-primary-color">
							<FiSearch size={48} className="mx-auto opacity-50" />
						</div>
						<h3 className="text-lg font-medium text-color-text mb-2">
							{searchQuery ? "Товары не найдены" : "Нет товаров"}
						</h3>
						<p className="text-gray-500 mb-6">
							{searchQuery
								? "Попробуйте изменить параметры поиска"
								: "Добавьте первый товар в вашу систему"}
						</p>
						<Button
							className="bg-light-secondary-color text-primary-color border border-primary-color/20"
							onPress={() => handleAddItem()}
							startContent={<FiPlus />}
						>
							Добавить товар
						</Button>
					</div>
				)}
			</div>

			<CreateItemModal onClose={closeModal} />
		</div>
	);
};

export default AdminItems;