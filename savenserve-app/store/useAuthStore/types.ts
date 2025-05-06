export interface AuthState {
	isAuthModalOpen: boolean;
	user: any | null;
	email: string,
	password: string,
	loading: boolean;
	error: string;
	isLogin: boolean;

	openAuthModal: () => void;
	closeAuthModal: () => void;
	toggleAuthMode: () => void;
	setUser: (user: any | null) => void;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	handleAuth: (email: string, password: string) => Promise<void>;
	handleLogout: () => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	subscribeToAuthChanges: () => void;
	updateProfile: (name: string, avatar_url: string | null) => Promise<{success: boolean, error?: string}>;
	uploadAvatar: (file: File) => Promise<{success: boolean, avatarUrl?: string, error?: string}>;
	resetPassword: (email: string) => Promise<{success: boolean, error?: string}>;
	sendEmailConfirmation: (email: string) => Promise<{success: boolean, error?: string}>;
	updateSubscription: (isSubscribed: boolean) => Promise<{success: boolean, error?: string}>;
	fetchUserProfile: () => Promise<any | null>;
}