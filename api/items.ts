import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { ItemImage, ItemWithImages } from '@/store/useItemStore/types';

const supabase = createClient();

export const fetchItems = async (): Promise<ItemWithImages[]> => {
	const { data, error } = await supabase.from('items').select(`
    id,
    category_id,
		subcategory_id,
    name,
    description,
    price,
		discount_price,
		auto_discount,
    custom_discounts,
		address,
    best_before,
    brand,
    country_of_origin,
    information,
    normal_price,
    price_per_kg,
    weight,
		quantity,
		item_images (id, item_id, image_url)
  `);

	if (error) {
		throw new Error(error.message || 'Не удалось загрузить товары');
	}

	const itemsWithImages = data.map(item => ({
		...item,
		item_images: item.item_images || []
	}));

	return itemsWithImages as ItemWithImages[];
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
	subcategory_id: number | null,
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
	quantity: number;
	auto_discount: boolean;
	custom_discounts?: Record<string, number>;
}): Promise<ItemWithImages> => {
	const { id, ...updatedData } = payload;
	const { data, error } = await supabase
		.from('items')
		.update(updatedData)
		.eq('id', id)
		.select(`
      id,
      category_id,
			subcategory_id,
      name,
      description,
      price,
			discount_price,
			address,
    	best_before,
    	brand,
   	 	country_of_origin,
    	information,
    	normal_price,
    	price_per_kg,
    	weight,
			item_images (id, item_id, image_url),
			quantity,
			auto_discount,
			custom_discounts
    `)
		.single();

	if (error) {
		console.error('Ошибка обновления товара:', error.message);
		toast.error(`Ошибка обновления товара: ${error.message}`);
		throw new Error(error.message || 'Не удалось обновить товар');
	}

	toast.success('Товар успешно обновлён');
	return data as ItemWithImages;
};

export const createItem = async (payload: {
	category_id: number;
	subcategory_id: number | null,
	name: string;
	description?: string | null;
	price: number;
	discount_price: number;
	address?: string | null;
	best_before?: string | null;
	brand?: string | null;
	country_of_origin?: string | null;
	information?: string | null;
	normal_price?: number | null;
	price_per_kg?: number | null;
	weight?: string | null;
	quantity: number;
	auto_discount: boolean;
	custom_discounts?: Record<string, number>;
}): Promise<ItemWithImages> => {
	try {
		const { data, error } = await supabase
			.from('items')
			.insert({
				category_id: payload.category_id,
				subcategory_id: payload.subcategory_id,
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
				quantity: payload.quantity,
				discount_price: payload.price,
				auto_discount: payload.auto_discount,
				custom_discounts: payload.custom_discounts
			})
			.select()
			.single();

		if (error) {
			console.error('Ошибка создания товара:', error.message);
			toast.error(`Ошибка создания товара: ${error.message}`);
			throw new Error(error.message || 'Не удалось создать товар');
		}

		toast.success('Товар успешно создан');
		return {
			...data,
			item_images: data.item_images || []
		} as ItemWithImages;
	} catch (err) {
		console.error('Неизвестная ошибка при создании товара:', err);
		throw err;
	}
};

export const uploadItemImages = async (files: File[], itemId: number): Promise<string[]> => {
	const { data: itemExists, error: checkError } = await supabase
		.from('items')
		.select('id')
		.eq('id', itemId)
		.single();

	if (checkError || !itemExists) {
		console.error('Товар не найден в базе данных при загрузке изображений:', itemId);
		toast.error('Не удалось загрузить изображения: товар не найден');
		return [];
	}

	if (files.length > 5) {
		toast.warning('Можно загрузить не более 5 фотографий.');
		files = files.slice(0, 5);
	}

	const uploadedUrls: string[] = [];

	for (const file of files) {
		const filePath = `items/${itemId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._]/g, '_')}`;

		const { data, error } = await supabase.storage
			.from('item_images')
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: false
			});

		if (error) {
			console.error('Ошибка загрузки изображения:', error.message);
			toast.warning('Не удалось загрузить изображение');
			continue;
		}

		if (!data) {
			console.error('Не получены данные после загрузки изображения');
			continue;
		}

		const { data: publicUrlData } = supabase.storage
			.from('item_images')
			.getPublicUrl(data.path);

		const publicUrl = publicUrlData?.publicUrl;

		if (publicUrl) {
			uploadedUrls.push(publicUrl);

			const { error: insertError } = await supabase
				.from('item_images')
				.insert({ item_id: itemId, image_url: publicUrl });

			if (insertError) {
				console.error('Ошибка сохранения связи изображения с товаром:', insertError.message);
				toast.warning('Не удалось сохранить связь с изображением');
			}
		} else {
			console.error('Не удалось получить публичный URL для изображения');
		}
	}

	return uploadedUrls;
};

export const fetchItemImages = async (itemId: number): Promise<ItemImage[]> => {
	const { data, error } = await supabase
		.from('item_images')
		.select('id, item_id, image_url')
		.eq('item_id', itemId);

	if (error) {
		console.error('Ошибка загрузки изображений:', error.message);
		throw new Error('Не удалось загрузить изображения');
	}

	return data as ItemImage[];
};

export const deleteItemImage = async (imageData: string | ItemImage | unknown): Promise<void> => {
	let imageUrl: string;

	if (typeof imageData === 'string') {
		imageUrl = imageData;
	} else if (imageData && typeof imageData === 'object' && 'image_url' in imageData) {
		imageUrl = imageData.image_url as string;
	} else {
		console.error('Некорректный формат данных изображения:', imageData);
		throw new Error('Некорректный формат данных изображения');
	}

	try {
		const matches = imageUrl.match(/\/item_images\/(.+)/);
		if (!matches || !matches[1]) {
			throw new Error('Не удалось извлечь путь к файлу из URL');
		}

		const filePath = matches[1];
		console.log('Путь к файлу для удаления:', filePath);

		const { error } = await supabase.storage
			.from('item_images')
			.remove([filePath]);

		if (error) {
			console.error('Ошибка удаления файла из хранилища:', error.message);
			throw new Error(`Не удалось удалить изображение: ${error.message}`);
		}

		const { error: dbError } = await supabase
			.from('item_images')
			.delete()
			.eq('image_url', imageUrl);

		if (dbError) {
			console.error('Ошибка удаления записи изображения:', dbError.message);
			throw new Error(`Не удалось удалить запись изображения: ${dbError.message}`);
		}

		toast.success('Изображение успешно удалено');
	} catch (err) {
		console.error('Ошибка в процессе удаления изображения:', err);
		if (err instanceof Error) {
			toast.error(err.message);
			throw err;
		}
		throw new Error('Произошла неизвестная ошибка при удалении изображения');
	}
};