import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useCartStore = create((set, get) => ({
	cartItems: [],
	cartId: null, // Стейт для хранения cartId пользователя

	initCart: async (userId: string) => {
		const { data: cartData, error: cartError } = await supabase
			.from('cart')
			.select('id')
			.eq('user_id', userId)
			.single();

		if (cartError && cartError.code !== 'PGRST116') {
			console.error('Error initializing cart:', cartError);
			return null;
		}

		if (cartData) {
			// Корзина уже существует
			set({ cartId: cartData.id });
			return cartData.id;
		}

		// Создаем новую корзину для пользователя
		const { data: newCart, error: newCartError } = await supabase
			.from('cart')
			.insert([{ user_id: userId }])
			.select()
			.single();

		if (newCartError) {
			console.error('Error creating cart:', newCartError);
			return null;
		}

		set({ cartId: newCart.id });
		return newCart.id;
	},

	fetchCartItems: async (userId: string) => {
		let cartId = get().cartId;

		if (!cartId) {
			// Если cartId отсутствует, инициализируем корзину
			cartId = await get().initCart(userId);
			if (!cartId) {
				console.error('Failed to initialize cart');
				return;
			}
		}

		const { data, error } = await supabase
			.from('cart_items')
			.select('id, quantity, item:items(*)') // Замените на актуальные поля таблицы
			.eq('cart_id', cartId);

		if (error) {
			console.error('Error fetching cart items:', error);
		} else {
			set({ cartItems: data || [] });
		}
	},

	// Добавляем товар в корзину
	addToCart: async (userId: string, itemId: number, quantity = 1) => {
		let cartId = get().cartId;

		if (!cartId) {
			// Если cartId отсутствует, инициализируем корзину
			cartId = await get().initCart(userId);
			if (!cartId) {
				console.error('Failed to initialize cart');
				return;
			}
		}

		const { data, error } = await supabase
			.from('cart_items')
			.insert([{ cart_id: cartId, item_id: itemId, quantity }])
			.select();

		if (error) {
			console.error('Error adding to cart:', error);
		} else {
			set((state) => ({
				cartItems: [...state.cartItems, { ...data[0], item: { id: itemId } }],
			}));
		}
	},

	updateCartItem: async (cartItemId: number, quantity: number) => {
		if (quantity <= 0) {
			// Если количество 0 или меньше, удаляем товар из корзины
			const { error } = await supabase
				.from('cart_items')
				.delete()
				.eq('id', cartItemId);

			if (error) {
				console.error('Error removing item from cart:', error);
			} else {
				set((state) => ({
					cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
				}));
			}
			return; // Завершаем выполнение функции
		}

		// Если количество больше 0, обновляем товар
		const { error } = await supabase
			.from('cart_items')
			.update({ quantity })
			.eq('id', cartItemId);

		if (error) {
			console.error('Error updating cart item:', error);
		} else {
			set((state) => ({
				cartItems: state.cartItems.map((item) =>
					item.id === cartItemId ? { ...item, quantity } : item
				),
			}));
		}
	},

	// Удаляем товар из корзины
	removeFromCart: async (cartItemId: number) => {
		const { error } = await supabase
			.from('cart_items')
			.delete()
			.eq('id', cartItemId);

		if (error) {
			console.error('Error removing from cart:', error);
		} else {
			set((state) => ({
				cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
			}));
		}
	},
}));