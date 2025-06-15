import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { AuthState, AuthError } from './types';
import { toast } from "sonner";

const supabase = createClient();

const useAuthStore = create<AuthState>((set, get) => ({
	isAuthModalOpen: false,
	users: [],
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

	ensureUserProfile: async (user) => {
		if (!user) return { success: false, error: 'Пользователь не определен' };

		try {
			const { error } = await supabase
				.from('user_profiles')
				.upsert(
					{
						id: user.id,
						email: user.email,
						updated_at: new Date().toISOString()
					},
					{ onConflict: 'id' }
				);

			if (error) throw error;
			return { success: true };
		} catch (error) {
			console.error('Ошибка при создании/обновлении профиля пользователя:', error);
			return { success: false, error: 'Ошибка при создании профиля' };
		}
	},

	handleAuth: async (email: string, password: string) => {
		set({ loading: true, error: '' });
		try {
			const { isLogin } = get();
			if (isLogin) {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;

				await get().ensureUserProfile(data.user);

				set({ user: data.user, isAuthModalOpen: false });
				toast.success("Вход на аккаунт выполнен успешно.");
			} else {
				const { data, error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;

				toast.info("Успех, на вашу почту было выслано письмо с подтверждением.");
				set({ isAuthModalOpen: false });

				if (data.user) {
					await get().ensureUserProfile(data.user);

					// set({ user: data.user });
				}
			}
		} catch (error) {
			const err = error as AuthError;
			if (err.message === "User already registered") {
				set({ error: "Пользователь с таким email уже зарегистрирован" });
			} else if (err.message === "Invalid login credentials") {
				set({ error: "Неверный email или пароль" });
			} else if (err.message.includes("Email not confirmed")) {
				set({ error: "Email не подтвержден. Пожалуйста, проверьте вашу почту." });
			} else {
				set({ error: err.message });
			}
		} finally {
			set({ loading: false });
		}
	},

	handleLogout: async (onLogoutComplete?: () => void) => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			set({ user: null })
			toast.info("Выход из аккаунта произошел успешно.");

			if (onLogoutComplete) {
				onLogoutComplete();
			}
		} catch (error) {
			const err = error as AuthError;
			console.error('Logout error:', err.message);
		}
	},

	subscribeToAuthChanges: () => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			const prevUser = get().user;

			if (session?.user) {
				if (prevUser && prevUser.id === session.user.id) {
					return;
				}

				await get().ensureUserProfile(session.user);
				await get().fetchUserProfile();
			}

			if (!prevUser || !session?.user || prevUser.id !== session.user.id) {
				set({ user: session?.user || null });
			}
		});
	},

	signInWithGoogle: async () => {
		set({ loading: true, error: "" });
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/`,
				},
			});
			if (error) throw error;
		} catch (error) {
			const err = error as AuthError;
			set({ error: err.message });
		} finally {
			set({ loading: false });
		}
	},

	updateProfile: async (name: string, avatar_url: string | null) => {
		set({ loading: true, error: "" });
		try {
			const { error } = await supabase.auth.updateUser({
				data: {
					full_name: name,
					avatar_url: avatar_url
				}
			});

			if (error) throw error;

			const { data: { user } } = await supabase.auth.getUser();
			set({ user, loading: false });

			return { success: true };
		} catch (error) {
			const err = error as AuthError;
			set({ error: err.message, loading: false });
			return { success: false, error: err.message };
		}
	},

	uploadAvatar: async (file: File) => {
		const { user } = get();
		if (!user) return { success: false, error: 'Пользователь не авторизован' };

		try {
			const fileExt = file.name.split('.').pop();
			const fileName = `${user.id}_${Date.now()}.${fileExt}`;

			const { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(fileName, file, {
					cacheControl: '3600',
					upsert: true
				});

			if (uploadError) throw uploadError;

			const { data: publicUrlData } = supabase.storage
				.from('avatars')
				.getPublicUrl(fileName);

			return {
				success: true,
				avatarUrl: publicUrlData.publicUrl
			};
		} catch (error) {
			const err = error as AuthError;
			return {
				success: false,
				error: err.message
			};
		}
	},

	resetPassword: async (email: string) => {
		set({ loading: true, error: "" });
		try {
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`,
			});

			if (error) throw error;

			set({ loading: false });
			return { success: true };
		} catch (error) {
			const err = error as AuthError;
			set({ error: err.message, loading: false });
			return { success: false, error: err.message };
		}
	},

	sendEmailConfirmation: async (email: string) => {
		set({ loading: true, error: "" });
		try {
			const { error } = await supabase.auth.resend({
				type: 'signup',
				email: email,
			});

			if (error) throw error;

			set({ loading: false });
			return { success: true };
		} catch (error) {
			const err = error as AuthError;
			set({ error: err.message, loading: false });
			return { success: false, error: err.message };
		}
	},

	updateSubscription: async (isSubscribed: boolean) => {
		const { user } = get();
		if (!user) return { success: false, error: 'Пользователь не авторизован' };

		try {
			const { error } = await supabase
				.from('user_profiles')
				.upsert({ id: user.id, is_subscribed: isSubscribed, email: user.email }, { onConflict: 'id' });

			if (error) throw error;

			const updatedUser = {
				...user,
				profile: {
					...(user.profile || {}),
					is_subscribed: isSubscribed,
					email: user.email,
				}
			};

			set({ user: updatedUser });

			return { success: true };
		} catch (error) {
			const err = error as AuthError;
			return { success: false, error: err.message };
		}
	},

	fetchUserProfile: async () => {
		const { user } = get();
		if (!user || user.profile) return null;

		try {
			const { data, error } = await supabase
				.from('user_profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (error) throw error;

			const updatedUser = {
				...user,
				profile: {
					...data,
					is_subscribed: !!data?.is_subscribed
				}
			};

			set({ user: updatedUser });
			return data;
		} catch {
			return null;
		}
	},

	fetchUsers: async () => {
		try {
			const { data, error } = await supabase
				.from('user_profiles')
				.select('*');

			if (error) throw error;

			set({ users: data || [] });
			return data;
		} catch (error) {
			console.error('Ошибка при загрузке пользователей:', error);
			return [];
		}
	},

	setUser: (user) => set({ user }),
}));

export default useAuthStore;