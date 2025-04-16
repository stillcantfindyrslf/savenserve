export type Item = {
  id: number;
  category_id: number;
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
  images: string[];
  quantity: number;
};

export type ItemState = {
  items: Item[];
  isLoaded: boolean;
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  createItem: (payload: Omit<Item, 'id'>) => Promise<void>;
  updateItem: (id: number, updatedData: Partial<Item>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  uploadImages: (files: File[], itemId: number) => Promise<string[]>;
  deleteImage: (imageUrl: string) => Promise<void>;
  clearItems: () => void;
};