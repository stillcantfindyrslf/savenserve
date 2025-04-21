export type Category = {
  id: number;
  name: string;
  description: string | null;
  url_name: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: number;
  name: string;
  url_name: string | null;
  category_id: number | null;
};

export type CategoryState = {
  categories: Category[];
  selectedCategory: Category | null;
  isLoaded: boolean;
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  fetchCategoryWithSubcategories: (urlName: string) => Promise<void>;
  clearCategories: () => void;
};