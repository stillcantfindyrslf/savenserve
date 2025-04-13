import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { Item } from '@/store/useItemStore/types';

const supabase = createClient();

export const fetchItems = async (): Promise<Item[]> => {
	const { data, error } = await supabase.from('items').select(`
    id,
    category_id,
    name,
    description,
    price,
		address,
    best_before,
    brand,
    country_of_origin,
    information,
    normal_price,
    price_per_kg,
    weight,
		item_images (image_url)
  `);

	if (error) {
		throw new Error(error.message || 'Не удалось загрузить товары');
	}

	return data.map((item) => ({
		...item,
		images: item.item_images.map((img) => img.image_url),
	}));
};

export const deleteItemById = async (itemId: number): Promise<void> => {
	const { error } = await supabase.from('items').delete().eq('id', itemId);

	if (error) {
		console.error('Ошибка удаления товара:', error.message);
		toast.error(`Ошибка удаления товара: ${error.message}`);
		throw new Error(error.message || 'Не удалось удалить товар');
	}

	toast.success('Товар успешно удалён');
};

export const updateItemById = async (payload: {
	id: number;
	category_id?: number;
	name?: string;
	description?: string | null;
	price?: number;
	address?: string | null;
	best_before?: string | null;
	brand?: string | null;
	country_of_origin?: string | null;
	information?: string | null;
	normal_price?: number | null;
	price_per_kg?: number | null;
	weight?: string | null;
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
			address,
    	best_before,
    	brand,
   	 	country_of_origin,
    	information,
    	normal_price,
    	price_per_kg,
    	weight
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

export const createItem = async (payload: {
	category_id: number;
	name: string;
	description?: string | null;
	price: number;
	address?: string | null;
	best_before?: string | null;
	brand?: string | null;
	country_of_origin?: string | null;
	information?: string | null;
	normal_price?: number | null;
	price_per_kg?: number | null;
	weight?: string | null;
}): Promise<Item> => {
	try {
		const { data, error } = await supabase
			.from('items')
			.insert({
				category_id: payload.category_id,
				name: payload.name,
				description: payload.description || null,
				price: payload.price,
				address: payload.address || null,
				best_before: payload.best_before || null,
				brand: payload.brand || null,
				country_of_origin: payload.country_of_origin || null,
				information: payload.information || null,
				normal_price: payload.normal_price || null,
				price_per_kg: payload.price_per_kg || null,
				weight: payload.weight || null,
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
	} catch (err) {
		console.error('Неизвестная ошибка при создании товара:', err);
		throw err;
	}
};

export const uploadItemImage = async (file: File): Promise<string | null> => {
	const filePath = `items/${Date.now()}_${file.name}`;
	const { data, error } = await supabase.storage.from('item_images').upload(filePath, file);

	if (error) {
		console.error('Ошибка загрузки изображения:', error.message);
		throw new Error('Не удалось загрузить изображение');
	}

	const publicUrl = supabase.storage.from('item_images').getPublicUrl(data.path).data?.publicUrl;
	return publicUrl || null;
};

export const uploadItemImages = async (files: File[], itemId: number): Promise<string[]> => {
	if (files.length > 5) {
		toast.warning('Можно загрузить не более 5 фотографий.');
	}

	const uploadedUrls: string[] = [];

	for (const file of files) {
		const filePath = `items/${Date.now()}_${file.name}`;
		const { data, error } = await supabase.storage.from('item_images').upload(filePath, file);

		if (error) {
			console.error('Ошибка загрузки изображения:', error.message);
			toast.warning('Не удалось загрузить изображение');
		}

		const publicUrl = supabase.storage.from('item_images').getPublicUrl(data.path).data?.publicUrl;
		if (publicUrl) {
			uploadedUrls.push(publicUrl);

			await supabase.from('item_images').insert({ item_id: itemId, image_url: publicUrl });
		}
	}

	return uploadedUrls;
};

export const fetchItemImages = async (itemId: number): Promise<string[]> => {
	const { data, error } = await supabase
		.from('item_images')
		.select('image_url')
		.eq('item_id', itemId);

	if (error) {
		console.error('Ошибка загрузки изображений:', error.message);
		throw new Error('Не удалось загрузить изображения');
	}

	return data.map((row) => row.image_url);
};

export const deleteItemImage = async (imageUrl: string): Promise<void> => {
	const filePath = imageUrl.split('/').slice(-2).join('/');
	const { error } = await supabase.storage.from('item_images').remove([filePath]);

	if (error) {
		console.error('Ошибка удаления изображения:', error.message);
		throw new Error('Не удалось удалить изображение');
	}

	const { error: dbError } = await supabase
		.from('item_images')
		.delete()
		.eq('image_url', imageUrl);

	if (dbError) {
		console.error('Ошибка удаления записи изображения:', dbError.message);
		throw new Error('Не удалось удалить запись изображения');
	}
};