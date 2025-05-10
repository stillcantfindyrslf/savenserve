import { createClient } from '@/utils/supabase/client';
import { CartItem } from '@/store/useCartStore/types';

const supabase = createClient();

export const initializeCart = async (): Promise<number | null> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.error('Ошибка при получении текущего пользователя:', userError);
    throw new Error('Не удалось получить текущего пользователя');
  }

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from('cart')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Ошибка при инициализации корзины:', error);
    throw new Error('Не удалось инициализировать корзину');
  }

  if (data) {
    return data.id;
  }

  const { data: newCart, error: createError } = await supabase
    .from('cart')
    .insert([{ user_id: userId }])
    .select('id')
    .single();

  if (createError) {
    console.error('Ошибка при создании корзины:', createError);
    throw new Error('Не удалось создать корзину');
  }

  return newCart?.id || null;
};

export const fetchCart = async (): Promise<number | null> => {
  const { data, error } = await supabase
    .from('cart')
    .select('id')
    .single();

  if (error) {
    console.error('Ошибка при получении корзины:', error);
    return null;
  }

  return data?.id || null;
};

export const fetchCartItems = async (): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, quantity, item:items(*)');

  if (error) {
    console.error('Ошибка при загрузке товаров в корзине:', error);
    throw new Error('Не удалось загрузить товары в корзине');
  }

  const cartItems = (data || []).map((item: any): CartItem => ({
    id: item.id,
    item_id: item.item_id,
    quantity: item.quantity,
    item: {
      id: item.item.id,
      name: item.item.name,
      description: item.item.description,
      price: item.item.price,
      quantity: item.item.quantity,
      images: item.item.images || []
    }
  }));

  return cartItems;
};

export const addToCart = async (cartId: number, itemId: number, quantity: number): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      [
        {
          cart_id: cartId,
          item_id: itemId,
          quantity,
        },
      ],
      { onConflict: 'cart_id, item_id' }
    );

  if (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    throw new Error('Не удалось добавить товар в корзину');
  }
};

export const updateCartItemQuantity = async (cartItemId: number, newQuantity: number): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity: newQuantity })
    .eq('id', cartItemId);

  if (error) {
    console.error('Ошибка при обновлении количества товара в корзине:', error);
    throw new Error('Не удалось обновить количество товара в корзине');
  }
};

export const removeFromCart = async (cartItemId: number): Promise<void> => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    throw new Error('Не удалось удалить товар из корзины');
  }
};