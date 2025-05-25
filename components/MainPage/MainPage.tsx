'use client';

import FloatingNavbar from "@/components/FloatingNavbar";
import ItemsList from "@/components/ItemsList";
import { useEffect, useState, useMemo } from "react";
import useItemsStore from "@/store/useItemStore";
import useCartStore from "@/store/useCartStore";
import SidebarCategory from "@/components/SidebarCategory";
import useCategoriesStore from "@/store/useCategoriesStore/useCategoriesStore";
import useBannerStore from "@/store/useBannerStore";
import AppSlider from "../AppSlider";
import { Banner } from "@/store/useBannerStore/types";
import { Spinner } from "@nextui-org/react";

export default function MainPage() {
	const { banners, fetchBanners } = useBannerStore();
	const { items, fetchItems } = useItemsStore();
	const { fetchCartItems } = useCartStore()
	const { categories, fetchCategories } = useCategoriesStore();

	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				await Promise.all([
					fetchItems(),
					fetchBanners(),
					fetchCartItems(),
					fetchCategories()
				]);
			} catch (error) {
				console.error("Error loading data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [fetchItems, fetchBanners, fetchCartItems, fetchCategories]);

	const activeBanners = useMemo(() => {
		return banners.filter((banner: Banner) => banner.is_active);
	}, [banners]);

	const filteredItems = useMemo(() => {
		return items.filter(item =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [items, searchQuery]);

	if (loading) {
		return (
			<>
				<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className="flex justify-center items-center h-[70vh]">
					<Spinner size="lg" color="success" />
				</div>
			</>
		);
	}

	return (
		<>
			<FloatingNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<AppSlider banners={activeBanners} />
			<div className="flex mt-5">
				<div className="hidden cards-md:block min-w-[230px] flex-shrink-0 pr-4">
					<SidebarCategory categories={categories} />
				</div>
				<div className="flex-grow w-full">
					<ItemsList items={filteredItems} />
				</div>
			</div>
		</>
	);
}