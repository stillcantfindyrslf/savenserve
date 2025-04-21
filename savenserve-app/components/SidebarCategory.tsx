import React, { FC } from "react";
import { Category } from "@/store/useCategoriesStore/types";
import { useRouter } from "next/navigation";
import { LuMilk, LuWheat } from "react-icons/lu";
import { TbBottle, TbCoffee, TbMeat, TbChefHat, TbCandy, TbBrandPeanut  } from "react-icons/tb";
import { CiBowlNoodles } from "react-icons/ci";
import { GiOpenedFoodCan } from "react-icons/gi";

interface SidebarCategoryProps {
	categories: Category[];
	activeCategoryUrlName?: string;
}

const SidebarCategory: FC<SidebarCategoryProps> = ({ categories, activeCategoryUrlName }) => {
	const router = useRouter();

	const icons = [<LuWheat key="wheat" />, <TbChefHat key="cook" />, <TbMeat key="meat" />, <TbCoffee key="coffe" />,
		<TbCandy key="candy" />, <LuMilk key="milk" />, <TbBottle key="bottle" />, <CiBowlNoodles key="pasta" />,
		<GiOpenedFoodCan key="food-can" />, <TbBrandPeanut key="peanut" />
	];

	return (
		<>
			<h2 className="text-lg px-3 mb-2">Категории</h2>
			<div aria-label="Список категорий" className="space-y-1">
				{categories.map((category, index) => (
					<div
						key={category.url_name}
						onClick={() => router.push(`/category/${category.url_name}`)}
						className={`flex items-center cursor-pointer px-2 py-2 text-gray-700 rounded-md transition-colors ${activeCategoryUrlName === category.url_name
								? "border-2 border-primary-color bg-white"
								: "hover:bg-white"
							}`}
					>
						<span className="mr-1 text-lg">{icons[index % icons.length]}</span>
						{category.name}
					</div>
				))}
			</div>
		</>
	);
};

export default SidebarCategory;