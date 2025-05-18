import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useAuthStore from '@/store/useAuthStore';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useRoleCheck = () => {
  const { user } = useAuthStore();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Ошибка при получении роли пользователя:', error);
          toast.error('Не удалось загрузить данные пользователя');
          setRole(null);
        } else {
          setRole(data.role);
        }
      } catch (err) {
        console.error('Ошибка при запросе роли пользователя:', err);
        setRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const checkIsAdmin = () => {
    if (!user) {
      toast.error('Необходимо авторизоваться');
      return false;
    }

    if (role !== 'ADMIN') {
      toast.error('У вас нет доступа к административным функциям');
      return false;
    }

    return true;
  };

  return {
    isAdmin: role === 'ADMIN',
    checkIsAdmin,
  };
};