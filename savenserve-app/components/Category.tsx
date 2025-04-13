"use client";

import { useParams } from "next/navigation";
import useItemsStore from "@/store/useItemStore";
import { useCategoriesStore } from "@/store/useCategoriesStore";
import ItemsList from "@/components/ItemsList";
import FloatingNavbar from "@/components/FloatingNavbar";
import { useState, useMemo } from "react";
import SidebarCategory from "@/components/SidebarCategory";

export default function Category() {
	const { id } = useParams();
	const { categories } = useCategoriesStore();
	const { items } = useItemsStore();
	const [searchQuery, setSearchQuery] = useState("");

	const categoryId = Number(id);
	const category = categories.find((c) => c.id === categoryId);

	const filteredItems = useMemo(() => {
		return items
			.filter((item) => item.category_id === categoryId)
			.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [categoryId, items, searchQuery]);


	if (!category) {
		return <p className="text-center mt-10 text-xl">Категория не найдена</p>;
	}

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className="flex mt-32">
				<div className="w-1/4 pr-4">
					<SidebarCategory categories={categories} activeCategoryId={categoryId}/>
				</div>
				<div className="w-3/4">
					<h1 className="text-3xl font-bold text-primary-color">{category.name}</h1>
					<p className="text-md font-semibold text-gray-600 mb-5">{category.description}</p>
					<ItemsList items={filteredItems}/>
				</div>
			</div>
		</>
	);
}