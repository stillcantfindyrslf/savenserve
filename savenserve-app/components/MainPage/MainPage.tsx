'use client';

import FloatingNavbar from "@/components/FloatingNavbar";
import ItemsList from "@/components/ItemsList";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {useItemsStore} from "@/store/useItemStore/useItemStore";

export default function MainPage() {
	const { items, fetchItems } = useItemsStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredItems, setFilteredItems] = useState(items);

	useEffect(() => {
		const filtered = items.filter((item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		setFilteredItems(filtered);
	}, [searchQuery, items]);

	useEffect(() => {
		const loadData = async () => {
			try {
				await fetchItems();
			} catch (error) {
				toast.error("Ошибка при загрузке данных");
			}
		};
		loadData();
	}, [fetchItems]);

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<ItemsList items={filteredItems} />
		</>
	);
}