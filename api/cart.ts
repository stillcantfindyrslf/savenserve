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
    .select('id, quantity, item:items(id, name, description, price, quantity, item_images(id, item_id, image_url))');

  if (error) {
    console.error('Ошибка при загрузке товаров в корзине:', error);
    throw new Error('Не удалось загрузить товары в корзине');
  }

  const cartItems: CartItem[] = (data || []).map((rawItem: any): CartItem => {
    return {
      id: rawItem.id,
      item_id: rawItem.item_id || rawItem.item.id,
      quantity: rawItem.quantity,
      item: {
        id: rawItem.item.id,
        name: rawItem.item.name,
        description: rawItem.item.description,
        price: rawItem.item.price,
        quantity: rawItem.item.quantity,
        item_images: rawItem.item.item_images || []
      }
    };
  });

  return cartItems;
};

export const addToCart = async (cartId: number, itemId: number, quantity: number): Promise<void> => {
  const { data: itemData, error: itemError } = await supabase
    .from('items')
    .select('quantity')
    .eq('id', itemId)
    .single();

  if (itemError) {
    console.error('Ошибка при получении информации о товаре:', itemError);
    throw new Error('Не удалось получить информацию о товаре');
  }

  if (!itemData || itemData.quantity < quantity) {
    throw new Error('Недостаточно товара на складе');
  }

  const { data: cartItemData, error: cartItemError } = await supabase
    .from('cart_items')
    .select('quantity')
    .eq('cart_id', cartId)
    .eq('item_id', itemId)
    .single();

  if (cartItemError && cartItemError.code !== 'PGRST116') {
    console.error('Ошибка при проверке товара в корзине:', cartItemError);
    throw new Error('Не удалось проверить наличие товара в корзине');
  }

  const newItemQuantity = itemData.quantity - quantity;

  const { error: updateItemError } = await supabase
    .from('items')
    .update({ quantity: newItemQuantity })
    .eq('id', itemId);

  if (updateItemError) {
    console.error('Ошибка при обновлении количества товара на складе:', updateItemError);
    throw new Error('Не удалось обновить количество товара на складе');
  }

  try {
    if (cartItemData) {
      const newQuantity = cartItemData.quantity + quantity;

      const { error: upsertError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('cart_id', cartId)
        .eq('item_id', itemId);

      if (upsertError) {
        throw new Error('Не удалось обновить товар в корзине');
      }
    } else {
      const { error: upsertError } = await supabase
        .from('cart_items')
        .insert([{ cart_id: cartId, item_id: itemId, quantity }]);

      if (upsertError) {
        throw new Error('Не удалось добавить товар в корзину');
      }
    }
  } catch (error) {
    await supabase
      .from('items')
      .update({ quantity: itemData.quantity })
      .eq('id', itemId);

    console.error('Ошибка при добавлении товара в корзину:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (cartItemId: number, newQuantity: number): Promise<void> => {
  const { data: cartItemData, error: cartItemError } = await supabase
    .from('cart_items')
    .select('item_id, quantity')
    .eq('id', cartItemId)
    .single();

  if (cartItemError) {
    console.error('Ошибка при получении информации о товаре в корзине:', cartItemError);
    throw new Error('Не удалось получить информацию о товаре в корзине');
  }

  const { data: itemData, error: itemError } = await supabase
    .from('items')
    .select('quantity')
    .eq('id', cartItemData.item_id)
    .single();

  if (itemError) {
    console.error('Ошибка при получении информации о товаре на складе:', itemError);
    throw new Error('Не удалось получить информацию о товаре на складе');
  }

  const quantityDiff = newQuantity - cartItemData.quantity;

  if (quantityDiff > 0 && itemData.quantity < quantityDiff) {
    throw new Error('Недостаточно товара на складе');
  }

  const { error: updateItemError } = await supabase
    .from('items')
    .update({ quantity: itemData.quantity - quantityDiff })
    .eq('id', cartItemData.item_id);

  if (updateItemError) {
    console.error('Ошибка при обновлении количества товара на складе:', updateItemError);
    throw new Error('Не удалось обновить количество товара на складе');
  }

  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', cartItemId);

    if (error) {
      throw new Error('Не удалось обновить количество товара в корзине');
    }
  } catch (error) {
    await supabase
      .from('items')
      .update({ quantity: itemData.quantity })
      .eq('id', cartItemData.item_id);

    console.error('Ошибка при обновлении количества товара в корзине:', error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: number): Promise<void> => {
  const { data: cartItemData, error: cartItemError } = await supabase
    .from('cart_items')
    .select('item_id, quantity')
    .eq('id', cartItemId)
    .single();

  if (cartItemError) {
    throw new Error('Не удалось получить информацию о товаре в корзине');
  }

  const { data: itemData, error: itemError } = await supabase
    .from('items')
    .select('quantity')
    .eq('id', cartItemData.item_id)
    .single();

  if (itemError) {
    throw new Error('Не удалось получить информацию о товаре на складе');
  }

  const { error: updateItemError } = await supabase
    .from('items')
    .update({ quantity: itemData.quantity + cartItemData.quantity })
    .eq('id', cartItemData.item_id);

  if (updateItemError) {
    throw new Error('Не удалось обновить количество товара на складе');
  }

  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      throw new Error('Не удалось удалить товар из корзины');
    }
  } catch (error) {
    await supabase
      .from('items')
      .update({ quantity: itemData.quantity })
      .eq('id', cartItemData.item_id);

    console.error('Ошибка при удалении товара из корзины:', error);
    throw error;
  }
};

export const removeItemWithoutRestoring = async (cartItemId: number): Promise<void> => {
  const { error: cartItemError } = await supabase
    .from('cart_items')
    .select('item_id, quantity')
    .eq('id', cartItemId)
    .single();

  if (cartItemError) {
    throw new Error('Не удалось получить информацию о товаре в корзине');
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    throw new Error('Не удалось удалить товар из корзины');
  }
};