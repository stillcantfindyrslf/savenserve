import { create } from 'zustand';
import {
  fetchCart,
  fetchCartItems as apiFetchCartItems,
  addToCart as apiAddToCart,
  updateCartItemQuantity as apiUpdateCartItemQuantity,
  removeFromCart as apiRemoveFromCart,
  initializeCart as apiInitializeCart,
  removeItemWithoutRestoring as apiRemoveItemWithoutRestoring,
} from '@/api/cart';
import { CartStore } from './types';
import { toast } from 'sonner';

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

  addToCart: async (itemId: number, quantity: number) => {
    try {
      let cartId = get().cartId;

      if (!cartId) {
        const newCartId = await apiInitializeCart();
        if (!newCartId) {
          throw new Error('Не удалось инициализировать корзину');
        }
        cartId = newCartId;
        set({ cartId });
      }

      await apiAddToCart(cartId, itemId, quantity);

      await get().fetchCartItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка при добавлении товара в корзину');
    }
  },

  updateCartItem: async (cartItemId: number, newQuantity: number) => {
    try {
      await apiUpdateCartItemQuantity(cartItemId, newQuantity);

      await get().fetchCartItems();
    } catch (error) {
      console.error('Ошибка при обновлении количества товара в корзине:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при обновлении товара в корзине');
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
      toast.error(error instanceof Error ? error.message : 'Ошибка при удалении товара из корзины');
    }
  },

  removeItemWithoutRestoring: async (cartItemId: number) => {
    try {
      await apiRemoveItemWithoutRestoring(cartItemId);

      set((state) => ({
        cartItems: state.cartItems.filter((item) => item.id !== cartItemId),
      }));

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка при удалении полученного товара');
    }
  },
}));

export default useCartStore;