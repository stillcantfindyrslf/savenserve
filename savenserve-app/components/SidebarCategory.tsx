import React, { FC } from "react";
import { Category } from "@/store/useCategoriesStore";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface SidebarCategoryProps {
	categories: Category[];
	activeCategoryId?: number;
}

const SidebarCategory: FC<SidebarCategoryProps> = ({ categories, activeCategoryId }) => {
	const router = useRouter();

	return (
		<>
			<h2 className="text-lg font-semibold px-2 mb-2">Категории</h2>
			<Listbox
				aria-label="Список категорий"
				items={categories}
				onAction={(key) => router.push(`/category/${key}`)}
			>
				{(category) => (
					<ListboxItem
						key={category.id}
						className={`cursor-pointer px-4 py-2 rounded-lg ${
							activeCategoryId === category.id ? "bg-primary-color text-white font-bold" : "hover:bg-gray-100"
						}`}
					>
						{category.name}
					</ListboxItem>
				)}
			</Listbox>
		</>
	);
};

export default SidebarCategory;