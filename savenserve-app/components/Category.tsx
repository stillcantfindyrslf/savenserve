"use client";

import { useParams, useRouter } from "next/navigation";
import useItemsStore from "@/store/useItemStore";
import useCategoriesStore from "@/store/useCategoriesStore/useCategoriesStore";
import ItemsList from "@/components/ItemsList";
import FloatingNavbar from "@/components/FloatingNavbar";
import { useState, useMemo, useEffect } from "react";
import SidebarCategory from "@/components/SidebarCategory";
import CustomBadge from "./CustomBadge";

export default function Category() {
	const { categoryUrlName } = useParams();
	const router = useRouter();
	const { selectedCategory, fetchCategoryWithSubcategories, categories, fetchCategories } = useCategoriesStore();
	const { items, fetchItems } = useItemsStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	useEffect(() => {
		const loadData = async () => {
			await fetchCategories();
			await fetchCategoryWithSubcategories(categoryUrlName);
			await fetchItems();
		}
		loadData();
	}, [categoryUrlName, fetchCategoryWithSubcategories, fetchCategories]);

	const selectedSubcategory = useMemo(() => {
		return selectedCategory?.subcategories.find(
			(subcategory) => subcategory.url_name === categoryUrlName
		);
	}, [selectedCategory, categoryUrlName]);

	const allItemsCount = useMemo(() => {
		return items.filter((item) => item.category_id === selectedCategory?.id).length;
	}, [items, selectedCategory]);

	const toggleDescription = () => {
		setIsDescriptionExpanded((prev) => !prev);
	};

	const filteredItems = useMemo(() => {
		return items
			.filter((item) =>
				selectedSubcategory
					? item.subcategory_id === selectedSubcategory.id
					: item.category_id === selectedCategory?.id
			)
			.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [selectedCategory, selectedSubcategory, items, searchQuery]);

	const handleSubcategoryClick = (subcategoryUrlName: string | null) => {
		if (subcategoryUrlName) {
			router.push(`/category/${subcategoryUrlName}`);
		} else {
			router.push(`/category/${selectedCategory?.url_name}`);
		}
	};

	if (!selectedCategory) {
		return <p className="text-center mt-10 text-xl">Категория не найдена</p>;
	}

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<div className="flex mt-32">
				<div className="w-1/4 pr-4">
					<SidebarCategory categories={categories} activeCategoryUrlName={selectedCategory.url_name} />
				</div>
				<div className="w-3/4">
					<h1 className="text-3xl font-bold text-color-text">{selectedCategory.name}</h1>
					<p
						className={`text-md mt-3 text-gray-600 ${isDescriptionExpanded ? "" : "line-clamp-2"
							}`}
					>
						{selectedCategory.description}
					</p>
					{selectedCategory.description.length > 0 && (
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
				</div>
			</div>
		</>
	);
}