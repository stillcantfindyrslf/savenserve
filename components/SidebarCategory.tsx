import React, { FC } from "react";
import { Category } from "@/store/useCategoriesStore/types";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa6";
import useAuthStore from "@/store/useAuthStore";
import { getIconByName } from "@/utils/CategoryIcons";

interface SidebarCategoryProps {
	categories: Category[];
	activeCategoryUrlName?: string;
	onSelectFavorites?: () => void;
	onCategoryClick?: () => void;
}

const SidebarCategory: FC<SidebarCategoryProps> = ({
	categories,
	activeCategoryUrlName,
	onSelectFavorites,
	onCategoryClick
}) => {
	const router = useRouter();
	const { user } = useAuthStore();

	const handleCategoryClick = (urlName: string) => {
		router.push(`/category/${urlName}`);
		if (onCategoryClick) {
			onCategoryClick();
		}
	};

	const handleFavoritesClick = () => {
		if (onSelectFavorites) {
			onSelectFavorites();
		} else {
			router.push('/category/favorites?view=favorites');
		}
		if (onCategoryClick) {
			onCategoryClick();
		}
	};

	return (
		<div className="min-w-[230px] w-full">
			<h2 className="text-lg px-3 mb-2">Категории</h2>
			{user && (
				<div
					onClick={handleFavoritesClick}
					className={`flex items-center cursor-pointer px-2 py-2 text-gray-700 gap-2 rounded-md transition-colors ${activeCategoryUrlName === 'favorites'
						? "border-2 border-primary-color bg-white"
						: "hover:bg-white"
						}`}
				>
					<span className="text-lg">
						<FaRegHeart />
					</span>
					Избранное
				</div>
			)}
			<div aria-label="Список категорий" className="space-y-1">
				{categories.map((category) => (
					<div
						key={`category-${category.id}`}
						onClick={() => handleCategoryClick(category.url_name)}
						className={`flex items-center cursor-pointer px-2 py-2 text-gray-700 gap-2 rounded-md transition-colors ${activeCategoryUrlName === category.url_name
							? "border-2 border-primary-color bg-white"
							: "hover:bg-white"
							}`}
					>
						<span className="text-lg">
							{getIconByName(category.icon_name) || <span className="w-5 h-5 inline-block"></span>}
						</span>
						{category.name}
					</div>
				))}
			</div>
		</div>
	);
};

export default SidebarCategory;