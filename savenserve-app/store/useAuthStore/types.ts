export interface AuthState {
	isAuthModalOpen: boolean; // Состояние модального окна
	user: any | null; // Информация о пользователе
	loading: boolean; // Индикатор загрузки
	error: string; // Сообщение об ошибке
	isLogin: boolean; // Режим модального окна (вход или регистрация)

	// Методы для работы с состоянием
	openAuthModal: () => void;
	closeAuthModal: () => void;
	toggleAuthMode: () => void;
	setUser: (user: any | null) => void;
	handleAuth: (email: string, password: string) => Promise<void>;
	handleLogout: () => Promise<void>;
}