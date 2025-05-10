export type ItemImage = {
  id: number;
  item_id: number;
  image_url: string;
}

export type Item = {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  name: string;
  description: string | null;
  price: number;
  address: string | null;
  best_before: string | null;
  brand: string | null;
  country_of_origin: string | null;
  information: string | null;
  normal_price: number | null;
  price_per_kg: number | null;
  weight: string | null;
  quantity: number;
  discount_price: number;
  custom_discounts?: Record<string, number> | undefined;
  auto_discount: boolean;
};

export type ItemWithImages = Item & {
  item_images: ItemImage[];
};

export type ItemState = {
  items: ItemWithImages[];
  isLoaded: boolean;
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  createItem: (item: Partial<Item>) => Promise<Item | null>;
  updateItem: (id: number, updatedData: Partial<Item>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  uploadImages: (files: File[], itemId: number) => Promise<string[]>;
  fetchItemImages: (itemId: number) => Promise<ItemImage[]>;
  deleteImage: (imageUrl: string) => Promise<void>;
  clearItems: () => void;
};