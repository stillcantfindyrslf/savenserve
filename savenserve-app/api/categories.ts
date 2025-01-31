import { createClient } from "@/utils/supabase/client";
import {Category} from "@/store/useCategoriesStore";

const supabase = createClient();

export const fetchCategories = async (): Promise<Category[]> => {
	const { data, error } = await supabase.from('categories').select('id, name, description');

	if (error) {
		throw new Error(`Ошибка при загрузке категорий: ${error.message}`);
	}

	return data || [];
};
