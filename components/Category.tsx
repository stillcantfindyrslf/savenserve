"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import useItemsStore from "@/store/useItemStore";
import useCategoriesStore from "@/store/useCategoriesStore/useCategoriesStore";
import useLikeStore from "@/store/useLikesStote";
import useAuthStore from "@/store/useAuthStore";
import ItemsList from "@/components/ItemsList";
import FloatingNavbar from "@/components/FloatingNavbar";
import { useState, useMemo, useEffect } from "react";
import SidebarCategory from "@/components/SidebarCategory";
import CustomBadge from "./CustomBadge";
import { toast } from "sonner";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";
import { BsFilterLeft } from "react-icons/bs";
import { getSortLabel } from "@/public/staticlabels/getSortLabels";
import ProductFilters from "./filterItems";

export default function Category() {
	const params = useParams();
	const searchParams = useSearchParams();
	const isFavoritesView = searchParams.get('view') === 'favorites';
	const sortOrder = searchParams.get('sortOrder');
	const minPrice = searchParams.get('minPrice');
	const maxPrice = searchParams.get('maxPrice');
	const hasDiscount = searchParams.get('hasDiscount');
	const brand = searchParams.get('brand');
	const country = searchParams.get('country');
	const bestBeforeMax = searchParams.get('bestBeforeMax');
	const categoryUrlName = params?.categoryUrlName as string;
	const router = useRouter();
	const { selectedCategory, fetchCategoryWithSubcategories, categories, fetchCategories } = useCategoriesStore();
	const { items, fetchItems } = useItemsStore();
	const { user } = useAuthStore();
	const { likedItems, fetchLikedItems } = useLikeStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			await fetchCategories();
			if (!isFavoritesView && categoryUrlName) {
				await fetchCategoryWithSubcategories(categoryUrlName);
			}
			await fetchItems();

			if (user) {
				await fetchLikedItems(user.id);
			}
		}
		loadData();
	}, [categoryUrlName, fetchCategoryWithSubcategories, fetchCategories, fetchItems, fetchLikedItems, user, isFavoritesView]);

	const selectedSubcategory = useMemo(() => {
		if (isFavoritesView) return null;

		return selectedCategory?.subcategories.find(
			(subcategory) => subcategory.url_name === categoryUrlName
		);
	}, [selectedCategory, categoryUrlName, isFavoritesView]);

	const allItemsCount = useMemo(() => {
		if (isFavoritesView) {
			return likedItems.length;
		}
		return items.filter((item) => item.category_id === selectedCategory?.id).length;
	}, [items, selectedCategory, isFavoritesView, likedItems]);

	const toggleDescription = () => {
		setIsDescriptionExpanded((prev) => !prev);
	};

	const filteredItems = useMemo(() => {
		let filteredList;

		if (isFavoritesView) {
			filteredList = items
				.filter(item => likedItems.includes(item.id))
				.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
		} else {
			filteredList = items
				.filter((item) =>
					selectedSubcategory
						? item.subcategory_id === selectedSubcategory.id
						: item.category_id === selectedCategory?.id
				)
				.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		if (minPrice) {
			filteredList = filteredList.filter(item => item.price >= Number(minPrice));
		}

		if (maxPrice) {
			filteredList = filteredList.filter(item => item.price <= Number(maxPrice));
		}

		if (hasDiscount === 'true') {
			filteredList = filteredList.filter(item =>
				item.discount_price !== null && item.discount_price < item.price
			);
		}

		if (brand) {
			filteredList = filteredList.filter(item => item.brand === brand);
		}

		if (country) {
			filteredList = filteredList.filter(item => item.country_of_origin === country);
		}

		if (bestBeforeMax) {
			const maxDays = Number(bestBeforeMax);
			const today = new Date();
			const futureDate = new Date();
			futureDate.setDate(today.getDate() + maxDays);

			filteredList = filteredList.filter(item => {
				if (!item.best_before) return false;
				const bestBefore = new Date(item.best_before);
				return bestBefore <= futureDate;
			});
		}

		if (sortOrder) {
			switch (sortOrder) {
				case 'priceAsc':
					return [...filteredList].sort((a, b) => a.price - b.price);
				case 'priceDesc':
					return [...filteredList].sort((a, b) => b.price - a.price);
				case 'discountDesc':
					return [...filteredList].sort((a, b) => {
						if (a.price && a.discount_price !== null && b.price && b.discount_price !== null) {
							const discountA = ((a.price - a.discount_price) / a.price) * 100;
							const discountB = ((b.price - b.discount_price) / b.price) * 100;
							return discountB - discountA;
						}

						return 0;
					});
				case 'newest':
					return [...filteredList].sort((a, b) => {
						const dateA = a.best_before ? new Date(a.best_before).getTime() : 0;
						const dateB = b.best_before ? new Date(b.best_before).getTime() : 0;
						return dateB - dateA;
					});
				default:
					return filteredList;
			}
		}

		return filteredList;
	}, [selectedCategory, selectedSubcategory, items, searchQuery, isFavoritesView, likedItems, sortOrder, minPrice,
		maxPrice,
		hasDiscount,
		brand,
		country,
		bestBeforeMax]);

	const handleSubcategoryClick = (subcategoryUrlName: string | null) => {
		const currentSortOrder = searchParams.get('sortOrder');
		const query = new URLSearchParams();

		if (currentSortOrder) {
			query.set('sortOrder', currentSortOrder);
		}

		let path = '';
		if (subcategoryUrlName) {
			path = `/category/${subcategoryUrlName}?${query.toString()}`;
		} else {
			path = `/category/${selectedCategory?.url_name}?${query.toString()}`;
		}

		router.replace(path, { scroll: false });
	};

	const handleSortChange = (newSortOrder: string) => {
		const query = new URLSearchParams(searchParams.toString());
		query.set('sortOrder', newSortOrder);

		let path = '';
		if (selectedSubcategory) {
			path = `/category/${selectedSubcategory.url_name}?${query.toString()}`;
		} else if (selectedCategory) {
			path = `/category/${selectedCategory.url_name}?${query.toString()}`;
		}

		router.replace(path, { scroll: false });
	};

	const handleFilterChange = (newParams: URLSearchParams) => {
		let path = '';
		if (selectedSubcategory) {
			path = `/category/${selectedSubcategory.url_name}?${newParams.toString()}`;
		} else if (selectedCategory) {
			path = `/category/${selectedCategory.url_name}?${newParams.toString()}`;
		}

		router.replace(path, { scroll: false });
	};

	const handleSelectFavorites = () => {
		if (!user) {
			toast.warning("Войдите, чтобы увидеть понравившиеся товары");
			return;
		}
		router.push('/category/favorites?view=favorites');
	};

	const getCategoryItems = () => {
		if (isFavoritesView) {
			return items.filter(item => likedItems.includes(item.id));
		}
		return items.filter(item => item.category_id === selectedCategory?.id);
	};

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<div className="flex mt-32">
				<div className="hidden cards-md:block pr-4">
					<SidebarCategory
						categories={categories}
						activeCategoryUrlName={isFavoritesView ? "favorites" : selectedCategory?.url_name}
						onSelectFavorites={handleSelectFavorites}
					/>
				</div>
				<div className="flex-grow w-full lg:w-auto">
					{isFavoritesView ? (
						<>
							<h1 className="text-3xl font-bold text-color-text">Понравившиеся товары</h1>
							<p className="text-md mt-3 text-gray-600 mb-6">
								Здесь собраны товары, которые вам понравились.
							</p>

							{filteredItems.length === 0 ? (
								<div className="text-center py-12 bg-light-secondary-color rounded-lg border border-gray-200">
									<p className="font-medium text-color-text">
										{searchQuery
											? "Ничего не найдено по вашему запросу"
											: "У вас пока нет понравившихся товаров"}
									</p>
									<p className="text-sm mt-2 text-gray-600">
										{searchQuery
											? "Попробуйте изменить параметры поиска"
											: "Нажимайте на сердечко на карточке товара, чтобы добавить его в этот список"}
									</p>
								</div>
							) : (
								<ItemsList items={filteredItems} />
							)}
						</>
					) : selectedCategory ? (
						<>
							<h1 className="text-3xl font-bold text-color-text">{selectedCategory.name}</h1>
							<p
								className={`text-md mt-3 text-gray-600 ${isDescriptionExpanded ? "" : "line-clamp-2"
									}`}
							>
								{selectedCategory.description}
							</p>
							{selectedCategory.description !== null && (
								<button
									className="text-sm text-gray-600 underline mb-5"
									onClick={toggleDescription}
								>
									{isDescriptionExpanded ? "Скрыть" : "Показать больше"}
								</button>
							)}
							<div className="flex flex-wrap gap-1 mb-6">
								<button
									className={`flex items-center px-4 py-2 rounded-md font-semibold ${!selectedSubcategory
										? "border-2 border-primary-color bg-white"
										: "border-2 border-gray-200 bg-white text-gray-800"
										}`}
									onClick={() => handleSubcategoryClick(null)}
								>
									Все
									<CustomBadge
										count={allItemsCount}
										className="ml-2"
									/>
								</button>
								{selectedCategory.subcategories.map((subcategory) => (
									<button
										key={subcategory.id}
										className={`flex items-center px-4 py-2 rounded-md font-semibold ${selectedSubcategory?.id === subcategory.id
											? "border-2 border-primary-color bg-white"
											: "border-2 border-gray-200 bg-white text-gray-800"
											}`}
										onClick={() => handleSubcategoryClick(
											selectedSubcategory?.id === subcategory.id
												? null
												: subcategory.url_name
										)}
									>
										{subcategory.name}
										<CustomBadge
											count={items.filter((item) => item.subcategory_id === subcategory.id).length}
											className="ml-2"
										/>
									</button>
								))}
							</div>
							<div className="flex justify-between w-full border-y-[1px] border-gray-200 py-3 my-4">
								<ProductFilters
									items={getCategoryItems()}
									searchParams={new URLSearchParams(searchParams.toString())}
									categoryPath={selectedSubcategory ?
										`/category/${selectedSubcategory.url_name}` :
										`/category/${selectedCategory?.url_name}`}
									onFilterChange={handleFilterChange}
								/>

								<Dropdown>
									<DropdownTrigger>
										<Button
											variant="flat"
											startContent={<BsFilterLeft className="mt-0.5" size={24} />}
											className="bg-gray-50 text-gray-700 gap-0.5 text-color-text hover:underline"
										>
											{getSortLabel(sortOrder)}
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										aria-label="Сортировка"
										selectedKeys={sortOrder ? [sortOrder] : []}
										selectionMode="single"
										onAction={(key) => handleSortChange(key.toString())}
									>
										<DropdownItem key="priceAsc">Цена (по возрастанию)</DropdownItem>
										<DropdownItem key="priceDesc">Цена (по убыванию)</DropdownItem>
										<DropdownItem key="discountDesc">По скидке</DropdownItem>
										<DropdownItem key="newest">Новинки</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
							{filteredItems.length > 0 ? (
								<ItemsList items={filteredItems} />
							) : (
								<div className="text-center py-16 px-4 bg-light-secondary-color rounded-lg my-8">
									<div className="flex flex-col items-center">
										<h3 className="font-semibold text-xl text-color-text mb-2">
											В этой категории пока нет товаров
										</h3>
										<p className="text-gray-600 max-w-lg">
											Мы активно работаем над пополнением ассортимента.
											Совсем скоро здесь появятся товары со скидками!
										</p>
										<div className="mt-6 flex flex-col sm:flex-row gap-3">
											<Button
												variant="flat"
												className="bg-primary-color text-white"
												onPress={() => router.push('/')}
											>
												Перейти на главную
											</Button>
											<Button
												variant="bordered"
												className="border-gray-300"
												onPress={() => router.back()}
											>
												Вернуться назад
											</Button>
										</div>
									</div>
								</div>
							)}
						</>
					) : (
						<>
							<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
							<div className="flex justify-center items-center h-[70vh]">
								<Spinner size="lg" color="success" />
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}