import { Item } from "../useItemStore/types";

export type Category = {
    id: number;
    name: string;
};

export type AdminStoreState = {
    isModalOpen: boolean;
    currentItem: Item | null;
    categories: Category[];
    openModal: () => void;
    closeModal: () => void;
    setCurrentItem: (item: Item | null) => void;
    fetchCategories: () => Promise<void>;
};