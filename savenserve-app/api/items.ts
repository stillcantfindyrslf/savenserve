import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import {Item} from "@/store/useItemStore/useItemStore";

const supabase = createClient();

// Получение всех товаров
export const fetchItems = async (): Promise<Item[]> => {
	const { data, error } = await supabase.from('items').select(`
    id,
    category_id,
    name,
    description,
    price,
    image
  `);

	if (error) {
		throw new Error(error.message || 'Не удалось загрузить товары');
	}

	return data as Item[];
};

// Удаление товара по ID
export const deleteItemById = async (itemId: number): Promise<void> => {
	const { error } = await supabase.from('items').delete().eq('id', itemId);

	if (error) {
		console.error('Ошибка удаления товара:', error.message);
		toast.error(`Ошибка удаления товара: ${error.message}`);
		throw new Error(error.message || 'Не удалось удалить товар');
	}

	toast.success('Товар успешно удалён');
};

// Обновление товара по ID
export const updateItemById = async (payload: {
	id: number;
	category_id?: number;
	name?: string;
	description?: string | null;
	price?: number;
	image?: string | null;
}): Promise<Item> => {
	const { id, ...updatedData } = payload;
	const { data, error } = await supabase
		.from('items')
		.update(updatedData)
		.eq('id', id)
		.select(`
      id,
      category_id,
      name,
      description,
      price,
      image
    `)
		.single();

	if (error) {
		console.error('Ошибка обновления товара:', error.message);
		toast.error(`Ошибка обновления товара: ${error.message}`);
		throw new Error(error.message || 'Не удалось обновить товар');
	}

	toast.success('Товар успешно обновлён');
	return data as Item;
};

// Создание нового товара
export const createItem = async (payload: {
	category_id: number;
	name: string;
	description?: string | null;
	price: number;
	image?: string | null;
}): Promise<Item> => {
	const { category_id, name, description, price, image } = payload;
	const { data, error } = await supabase
		.from('items')
		.insert({
			category_id,
			name,
			description,
			price,
			image,
		})
		.select()
		.single();

	if (error) {
		console.error('Ошибка создания товара:', error.message);
		toast.error(`Ошибка создания товара: ${error.message}`);
		throw new Error(error.message || 'Не удалось создать товар');
	}

	toast.success('Товар успешно создан');
	return data as Item;
};