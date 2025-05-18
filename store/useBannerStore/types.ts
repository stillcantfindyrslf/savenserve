export interface Banner {
  id: number;
  title: string;
  description: string | null;
  button_text: string | null;
  button_link: string | null;
  image_url: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  currentBanner: Banner | null;
  isModalOpen: boolean;

  fetchBanners: () => Promise<Banner[]>;
  fetchActiveBanners: () => Promise<Banner[]>;
  createBanner: (banner: Partial<Banner>) => Promise<Banner>;
  updateBanner: (id: number, banner: Partial<Banner>) => Promise<Banner>;
  deleteBanner: (id: number) => Promise<void>;

  setCurrentBanner: (banner: Banner | null) => void;
  openModal: () => void;
  closeModal: () => void;

  uploadBannerImage: (file: File) => Promise<string>;
}