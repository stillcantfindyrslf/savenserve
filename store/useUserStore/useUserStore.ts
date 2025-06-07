import { create } from 'zustand';
import { UserStoreState } from './types';
import { usersApi } from '@/api/users';
import { ErrorType, getErrorMessage } from '@/store/ApiError';


const useUserStore = create<UserStoreState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await usersApi.getAll();
      set({ users, isLoading: false });
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      set({ error: getErrorMessage(error as ErrorType), isLoading: false });
      throw error;
    }
  },

  deleteUser: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await usersApi.delete(id);

      if (success) {
        set(state => ({
          users: state.users.filter(user => user.id !== id),
          isLoading: false
        }));
      }

      return success;
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      set({ error: getErrorMessage(error as ErrorType), isLoading: false });
      throw error;
    }
  },

  updateUserRole: async (id: string, role: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedUser = await usersApi.updateRole(id, role);

      set(state => ({
        users: state.users.map(user =>
          user.id === id ? updatedUser : user
        ),
        isLoading: false
      }));

      return updatedUser;
    } catch (error: unknown) {
      console.error('Error updating user role:', error);
      set({ error: getErrorMessage(error as ErrorType), isLoading: false });
      throw error;
    }
  }
}));

export default useUserStore;