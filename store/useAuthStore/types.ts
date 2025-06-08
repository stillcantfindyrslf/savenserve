export interface AuthError {
	message: string;
}

export interface UserProfile {
	id: string;
	email: string;
	is_subscribed?: boolean;
	role: 'ADMIN' | 'USER';
	created_at: string;
}

export interface AuthState {
	isAuthModalOpen: boolean;
	users: UserProfile[];
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
	ensureUserProfile: (user: any) => void;
	handleAuth: (email: string, password: string) => Promise<void>;
	handleLogout: (onLogoutComplete?: () => void) => Promise<void>;
	signInWithGoogle: () => Promise<void>;
	subscribeToAuthChanges: () => void;
	updateProfile: (name: string, avatar_url: string | null) => Promise<{ success: boolean, error?: string }>;
	uploadAvatar: (file: File) => Promise<{ success: boolean, avatarUrl?: string, error?: string }>;
	resetPassword: (email: string) => Promise<{ success: boolean, error?: string }>;
	sendEmailConfirmation: (email: string) => Promise<{ success: boolean, error?: string }>;
	updateSubscription: (isSubscribed: boolean) => Promise<{ success: boolean, error?: string }>;
	fetchUserProfile: () => Promise<any | null>;
	fetchUsers: () => Promise<UserProfile[]>;
}