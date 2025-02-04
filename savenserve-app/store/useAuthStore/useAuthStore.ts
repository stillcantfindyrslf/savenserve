import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { AuthState } from './types';
import {toast} from "sonner";

const supabase = createClient();

const useAuthStore = create<AuthState>((set, get) => ({
	isAuthModalOpen: false,
	user: null,
	email: '',
	password: '',
	loading: false,
	error: '',
	isLogin: true,

	openAuthModal: () => set({ isAuthModalOpen: true }),
	closeAuthModal: () => set({ isAuthModalOpen: false, error: '', isLogin: true }),
	toggleAuthMode: () => set((state) => ({ isLogin: !state.isLogin })),

	setEmail: (email) => set({ email }),
	setPassword: (password) => set({ password }),

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
				toast.info("Успех, на вашу почту было выслано письмо с подтверждением.");
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

	subscribeToAuthChanges: () => {
		supabase.auth.onAuthStateChange((event, session) => {
			set({ user: session?.user || null });
		});
	},

	signInWithGoogle: async () => {
		set({ loading: true, error: null });
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: window.location.origin,
				},
			});
			if (error) throw error;
		} catch (err) {
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	setUser: (user) => set({ user }),
}));

export default useAuthStore;