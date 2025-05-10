import {createClient} from '@/utils/supabase/client';

const supabase = createClient();

export const addLike = async (userId: string, itemId: number): Promise<void> => {
	const { error } = await supabase.from('liked_items').insert({
		user_id: userId,
		item_id: itemId,
	});

	if (error) {
		throw new Error('Ошибка при добавлении лайка');
	}
};

export const removeLike = async (userId: string, itemId: number): Promise<void> => {
	const { error } = await supabase
		.from('liked_items')
		.delete()
		.eq('user_id', userId)
		.eq('item_id', itemId);

	if (error) {
		throw new Error('Ошибка при удалении лайка');
	}
};

export const getLikedItems = async (userId: string): Promise<number[]> => {
	const { data, error } = await supabase
		.from('liked_items')
		.select('item_id')
		.eq('user_id', userId);

	if (error) {
		throw new Error('Ошибка при загрузке списка лайков');
	}

	return data?.map((item) => item.item_id) || [];
};