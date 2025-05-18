import { createClient } from '@/utils/supabase/client';
import { Banner } from '@/store/useBannerStore/types';

const supabase = createClient();

export const bannerApi = {
  fetchAll: async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },

  /**
   * Получить только активные баннеры
   */
  fetchActive: async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching active banners:', error);
      throw error;
    }
  },

  /**
   * Создать новый баннер
   */
  create: async (banner: Partial<Banner>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([{
          ...banner,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  /**
   * Обновить существующий баннер
   */
  update: async (id: number, banner: Partial<Banner>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update({
          ...banner,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  /**
   * Удалить баннер
   */
  delete: async (id: number) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  /**
   * Загрузить изображение для баннера
   */
  uploadImage: async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading banner image:', error);
      throw error;
    }
  }
};