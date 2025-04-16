import { create } from 'zustand';
import {
  fetchCart,
  fetchCartItems as apiFetchCartItems,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeFromCart as apiRemoveFromCart,
  initializeCart as apiInitializeCart,
} from '@/api/cart';
import { CartStore } from './types';

const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  cartId: null,
  isLoading: false,

  fetchCart: async () => {
    const cartId = await fetchCart();
    set({ cartId });
  },

  fetchCartItems: async () => {
    set({ isLoading: true });

    try {
      const data = await apiFetchCartItems();
      set({ cartItems: data });
    } catch (error) {
      console.error('Ошибка при загрузке товаров в корзине:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (itemId, quantity) => {
    let cartId = get().cartId;

    if (!cartId) {
      try {
        cartId = await apiInitializeCart();
        set({ cartId });
      } catch (error) {
        console.error('Ошибка при инициализации корзины:', error);
        return;
      }
    }

    try {
      await apiAddToCart(cartId, itemId, quantity);
      await get().fetchCartItems();
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
    }
  },

  updateCartItem: async (cartItemId: any, newQuantity: number) => {
    try {
      await apiUpdateCartItemQuantity(cartItemId, newQuantity);
      set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        ),
      }));
    } catch (error) {
      console.error('Ошибка при обновлении количества товара в корзине:', error);
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      await apiRemoveFromCart(cartItemId);
      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
      }));
    } catch (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
    }
  },
}));

export default useCartStore;