'use client';

import FloatingNavbar from "@/components/FloatingNavbar";
import ItemsList from "@/components/ItemsList";
import {useEffect, useState} from "react";
import useItemsStore from "@/store/useItemStore";
import SidebarCategory from "@/components/SidebarCategory";
import {useCategoriesStore} from "@/store/useCategoriesStore";

export default function MainPage() {
	const {items} = useItemsStore();
	const {categories} = useCategoriesStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredItems, setFilteredItems] = useState(items);

	useEffect(() => {
		const filtered = items.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredItems(filtered);
	}, [searchQuery, items]);

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
			<div className="flex mt-32">
				<div className="w-1/4 pr-4">
					<SidebarCategory categories={categories}/>
				</div>
				<div className="w-3/4">
					<ItemsList items={filteredItems}/>
				</div>
			</div>
		</>
	);
}