import { UserProfile } from '@/store/useAuthStore/types';
import { createClient } from '@/utils/supabase/client';
import { ErrorType, getErrorMessage } from '@/store/ApiError';
import { toast } from 'sonner';

const supabase = createClient();

export const usersApi = {
  getAll: async (): Promise<UserProfile[]> => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const userProfiles = await Promise.all((profiles || []).map(async (profile) => {
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id);

        return {
          ...profile,
          user_metadata: authData?.user?.user_metadata || {}
        };
      }));

      return userProfiles;
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  delete: async (userId: string): Promise<boolean> => {
    try {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      return true;
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      toast.error(getErrorMessage(error as ErrorType) || 'Не удалось удалить пользователя');
      throw error;
    }
  },

  updateRole: async (userId: string, role: string): Promise<UserProfile> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      const { data: authData } = await supabase.auth.admin.getUserById(userId);

      return {
        ...data,
        user_metadata: authData?.user?.user_metadata || {}
      };
    } catch (error: unknown) {
      console.error('Error updating user role:', error);
      toast.error(getErrorMessage(error as ErrorType) || 'Ошибка при обновлении роли пользователя');
      throw error;
    }
  }
};