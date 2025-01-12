import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { AuthState } from './types';

const supabase = createClient();

const useAuthStore = create<AuthState>((set, get) => ({
	isAuthModalOpen: false,
	user: null,
	loading: false,
	error: '',
	isLogin: true,

	openAuthModal: () => set({ isAuthModalOpen: true }),
	closeAuthModal: () => set({ isAuthModalOpen: false, error: '', isLogin: true }),

	toggleAuthMode: () => set((state) => ({ isLogin: !state.isLogin })),

	handleAuth: async (email: string, password: string) => {
		set({ loading: true, error: '' });
		try {
			const { isLogin } = get();
			if (isLogin) {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				set({ user: data.user, isAuthModalOpen: false });
			} else {
				const { data, error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
				set({ user: data.user, isAuthModalOpen: false });
			}
		} catch (err: any) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	handleLogout: async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			set({ user: null });
		} catch (err: any) {
			console.error('Logout error:', err.message);
		}
	},
}));

export default useAuthStore;