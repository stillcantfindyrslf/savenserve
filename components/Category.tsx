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

export default function Category() {
	const params = useParams();
	const searchParams = useSearchParams();
	const isFavoritesView = searchParams.get('view') === 'favorites';
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
		if (isFavoritesView) {
			return items
				.filter(item => likedItems.includes(item.id))
				.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		return items
			.filter((item) =>
				selectedSubcategory
					? item.subcategory_id === selectedSubcategory.id
					: item.category_id === selectedCategory?.id
			)
			.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [selectedCategory, selectedSubcategory, items, searchQuery, isFavoritesView, likedItems]);

	const handleSubcategoryClick = (subcategoryUrlName: string | null) => {
		if (subcategoryUrlName) {
			router.push(`/category/${subcategoryUrlName}`);
		} else {
			router.push(`/category/${selectedCategory?.url_name}`);
		}
	};

	const handleSelectFavorites = () => {
		if (!user) {
			toast.warning("Войдите, чтобы увидеть понравившиеся товары");
			return;
		}
		router.push('/category/favorites?view=favorites');
	};

	if (!selectedCategory && !isFavoritesView) {
		return <p className="text-center mt-10 text-xl">Категория не найдена</p>;
	}

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<div className="flex mt-32">
				<div className="w-1/4 pr-4">
					<SidebarCategory
						categories={categories}
						activeCategoryUrlName={isFavoritesView ? "favorites" : selectedCategory?.url_name}
						onSelectFavorites={handleSelectFavorites}
					/>
				</div>
				<div className="w-3/4">
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
							<ItemsList items={filteredItems} />
						</>
					) : (
						<p className="text-center mt-10 text-xl">Загрузка категории...</p>
					)}
				</div>
			</div>
		</>
	);
}