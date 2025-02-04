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
}