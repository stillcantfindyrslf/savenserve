import { create } from 'zustand';
import { BannerState } from './types';
import { toast } from 'sonner';
import { bannerApi } from '@/api/banner';

const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  isLoading: false,
  error: null,
  currentBanner: null,
  isModalOpen: false,

  fetchBanners: async () => {
    set({ isLoading: true });
    try {
      const data = await bannerApi.fetchAll();
      set({ banners: data, isLoading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  fetchActiveBanners: async () => {
    try {
      return await bannerApi.fetchActive();
    } catch (error: any) {
      console.error('Error in store while fetching active banners:', error);
      return [];
    }
  },

  createBanner: async (banner) => {
    set({ isLoading: true });
    try {
      const data = await bannerApi.create(banner);
      set(state => ({
        banners: [...state.banners, data],
        isLoading: false
      }));
      toast.success('Баннер успешно создан');
      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Ошибка при создании баннера');
      throw error;
    }
  },

  updateBanner: async (id, banner) => {
    set({ isLoading: true });
    try {
      const data = await bannerApi.update(id, banner);
      set(state => ({
        banners: state.banners.map(b => (b.id === id ? data : b)),
        isLoading: false
      }));
      toast.success('Баннер успешно обновлен');
      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Ошибка при обновлении баннера');
      throw error;
    }
  },

  deleteBanner: async (id) => {
    set({ isLoading: true });
    try {
      await bannerApi.delete(id);
      set(state => ({
        banners: state.banners.filter(banner => banner.id !== id),
        isLoading: false
      }));
      toast.success('Баннер успешно удален');
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Ошибка при удалении баннера');
      throw error;
    }
  },

  uploadBannerImage: async (file) => {
    set({ isLoading: true });
    try {
      const publicUrl = await bannerApi.uploadImage(file);
      set({ isLoading: false });
      return publicUrl;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      toast.error('Ошибка при загрузке изображения');
      throw error;
    }
  },

  setCurrentBanner: (banner) => set({ currentBanner: banner }),

  openModal: () => set({ isModalOpen: true }),

  closeModal: () => set({
    isModalOpen: false,
    currentBanner: null,
    error: null
  })
}));

export default useBannerStore;