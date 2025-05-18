import { createClient } from "@/utils/supabase/client";
import { Category, Subcategory } from "@/store/useCategoriesStore/types";
import { toast } from "sonner";

const supabase = createClient();

export const fetchCategories = async (): Promise<Category[]> => {
	const { data, error } = await supabase
		.from("categories")
		.select(`
			id,
			name,
			description,
			url_name,
			icon_name,
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

export const createCategory = async (category: Partial<Category>): Promise<Category> => {
	const { name, description, url_name, icon_name } = category;

	if (!name || !url_name) {
		throw new Error('Название и URL-имя обязательны для заполнения');
	}

	const { data, error } = await supabase
		.from("categories")
		.insert([{ name, description, url_name, icon_name }])
		.select()
		.single();

	if (error) {
		console.error('Ошибка при создании категории:', error);
		throw new Error(`Ошибка при создании категории: ${error.message}`);
	}

	toast.success('Категория успешно создана');
	return { ...data, subcategories: [] } as Category;
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
	const { name, description, url_name, icon_name } = category;

	const { data, error } = await supabase
		.from("categories")
		.update({ name, description, url_name, icon_name })
		.eq('id', id)
		.select()
		.single();

	if (error) {
		console.error('Ошибка при обновлении категории:', error);
		throw new Error(`Ошибка при обновлении категории: ${error.message}`);
	}

	toast.success('Категория успешно обновлена');
	return data as Category;
};

export const deleteCategory = async (id: number): Promise<void> => {
	const { count, error: countError } = await supabase
		.from('items')
		.select('*', { count: 'exact', head: true })
		.eq('category_id', id);

	if (countError) {
		throw new Error(`Ошибка при проверке товаров категории: ${countError.message}`);
	}

	if (count && count > 0) {
		throw new Error('Невозможно удалить категорию, содержащую товары');
	}

	const { error } = await supabase
		.from("categories")
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Ошибка при удалении категории:', error);
		throw new Error(`Ошибка при удалении категории: ${error.message}`);
	}

	toast.success('Категория успешно удалена');
};

export const createSubcategory = async (subcategory: Partial<Subcategory>): Promise<Subcategory> => {
	const { name, url_name, category_id } = subcategory;

	if (!name || !url_name || !category_id) {
		throw new Error('Название, URL-имя и ID категории обязательны для заполнения');
	}

	const { data, error } = await supabase
		.from("subcategory")
		.insert([{ name, url_name, category_id }])
		.select()
		.single();

	if (error) {
		console.error('Ошибка при создании подкатегории:', error);
		throw new Error(`Ошибка при создании подкатегории: ${error.message}`);
	}

	toast.success('Подкатегория успешно создана');
	return data as Subcategory;
};

export const updateSubcategory = async (id: number, subcategory: Partial<Subcategory>): Promise<Subcategory> => {
	const { name, url_name, category_id } = subcategory;

	const { data, error } = await supabase
		.from("subcategory")
		.update({ name, url_name, category_id })
		.eq('id', id)
		.select()
		.single();

	if (error) {
		console.error('Ошибка при обновлении подкатегории:', error);
		throw new Error(`Ошибка при обновлении подкатегории: ${error.message}`);
	}

	toast.success('Подкатегория успешно обновлена');
	return data as Subcategory;
};

export const deleteSubcategory = async (id: number): Promise<void> => {
	const { count, error: countError } = await supabase
		.from('items')
		.select('*', { count: 'exact', head: true })
		.eq('subcategory_id', id);

	if (countError) {
		throw new Error(`Ошибка при проверке товаров подкатегории: ${countError.message}`);
	}

	if (count && count > 0) {
		throw new Error('Невозможно удалить подкатегорию, содержащую товары');
	}

	const { error } = await supabase
		.from("subcategory")
		.delete()
		.eq('id', id);

	if (error) {
		console.error('Ошибка при удалении подкатегории:', error);
		throw new Error(`Ошибка при удалении подкатегории: ${error.message}`);
	}

	toast.success('Подкатегория успешно удалена');
};