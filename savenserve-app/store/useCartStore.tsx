import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useCartStore = create((set, get) => ({
	cartItems: [],
	cartId: null, // Хранит ID корзины
	isLoading: false,

	// Инициализация корзины
	initCart: async (userId) => {
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
			// Если корзина уже существует
			set({ cartId: cartData.id });
			return cartData.id;
		}

		// Создаем новую корзину
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

	// Получение товаров в корзине
	fetchCartItems: async (userId) => {
		set({ isLoading: true });
		let cartId = get().cartId;

		if (!cartId) {
			cartId = await get().initCart(userId);
			if (!cartId) {
				console.error('Failed to initialize cart');
				set({ isLoading: false });
				return;
			}
		}

		const { data, error } = await supabase
			.from('cart_items')
			.select('id, quantity, item:items(*)') // Обновите, если структура отличается
			.eq('cart_id', cartId);

		if (error) {
			console.error('Error fetching cart items:', error);
		} else {
			set({ cartItems: data || [] });
		}
		set({ isLoading: false });
	},

	// Добавление товара в корзину
	addToCart: async (userId, itemId, quantity = 1) => {
		let cartId = get().cartId;

		if (!cartId) {
			cartId = await get().initCart(userId);
			if (!cartId) {
				console.error('Failed to initialize cart');
				return;
			}
		}

		// Проверка: если товар уже в корзине, увеличиваем количество
		const existingItem = get().cartItems.find((item) => item.item.id === itemId);
		if (existingItem) {
			await get().updateCartItem(existingItem.id, existingItem.quantity + quantity);
			return;
		}

		// Добавляем новый товар
		const { data, error } = await supabase
			.from('cart_items')
			.insert([{ cart_id: cartId, item_id: itemId, quantity }])
			.select();

		if (error) {
			console.error('Error adding to cart:', error);
		} else {
			set((state) => ({
				cartItems: [...state.cartItems, { ...data[0], item: { id: itemId, ...data[0].item } }],
			}));
		}
	},

	// Обновление количества товара
	updateCartItem: async (cartItemId, quantity) => {
		if (quantity <= 0) {
			await get().removeFromCart(cartItemId);
			return;
		}

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

	// Удаление товара из корзины
	removeFromCart: async (cartItemId) => {
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

	// Очистка корзины
	clearCart: async () => {
		const cartId = get().cartId;

		if (!cartId) return;

		const { error } = await supabase
			.from('cart_items')
			.delete()
			.eq('cart_id', cartId);

		if (error) {
			console.error('Error clearing cart:', error);
		} else {
			set({ cartItems: [] });
		}
	},
}));
