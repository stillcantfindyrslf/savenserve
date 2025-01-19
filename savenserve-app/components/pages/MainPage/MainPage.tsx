'use client';

import AppSlider from "@/components/AppSlider";
import FloatingNavbar from "@/components/molecules/FloatingNavbar";
import ItemsList from "@/components/ItemsList";
import { useItemsStore } from "@/store/useItemStore/useItemStore";
import { useEffect } from "react";
import { toast } from "sonner";
import { fetchItems } from "@/api/items";
import useAuthStore from "@/store/useAuthStore";

export default function MainPage() {
	const { items, fetchItems } = useItemsStore();

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
		<div className="max-w-7xl mx-auto px-5">
			<FloatingNavbar />
			{/*<AppSlider />*/}
			<ItemsList items={items} />
		</div>
	);
}