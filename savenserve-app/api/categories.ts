import { createClient } from "@/utils/supabase/client";
import { Category } from "@/store/useCategoriesStore/types";

const supabase = createClient();

export const fetchCategories = async (): Promise<Category[]> => {
	const { data, error } = await supabase
		.from("categories")
		.select(`
			id,
			name,
			description,
			url_name,
			subcategories:subcategory (
					id,
					name,
					url_name,
					category_id
			)
	`);
	if (error) {
		throw new Error(`Ошибка при загрузке категорий: ${error.message}`);
	}

	return data || [];
};
