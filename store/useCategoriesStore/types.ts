export type Category = {
  id: number;
  name: string;
  description: string | null;
  url_name: string;
  icon_name: string | null;
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

  isCategoryModalOpen: boolean;
  isSubcategoryModalOpen: boolean;
  currentCategory: Category | null;
  currentSubcategory: Subcategory | null;

  fetchCategories: () => Promise<void>;
  fetchCategoryWithSubcategories: (urlName: string) => Promise<void>;
  clearCategories: () => void;

  openCategoryModal: () => void;
  closeCategoryModal: () => void;
  openSubcategoryModal: (categoryId?: number) => void;
  closeSubcategoryModal: () => void;
  setCurrentCategory: (category: Category | null) => void;
  setCurrentSubcategory: (subcategory: Subcategory | null) => void;

  createCategory: (category: Partial<Category>) => Promise<Category>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
  createSubcategory: (subcategory: Partial<Subcategory>) => Promise<Subcategory>;
  updateSubcategory: (id: number, subcategory: Partial<Subcategory>) => Promise<Subcategory>;
  deleteSubcategory: (id: number) => Promise<void>;
};