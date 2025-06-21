export type ItemImage = {
  id: number;
  item_id: number;
  image_url: string;
};

export type CartItem = {
  id: number;
  item_id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    address: string;
    quantity: number;
    item_images?: ItemImage[];
    images?: string[];
  };
};

export type CartStore = {
  cartItems: CartItem[];
  cartId: number | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  fetchCartItems: () => Promise<void>;
  addToCart: (itemId: number, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: number, newQuantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  removeItemWithoutRestoring: (cartItemId: number) => Promise<void>;
};