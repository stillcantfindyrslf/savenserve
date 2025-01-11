'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AuthModal } from '@/components/AuthModal';

export default function LoginButton() {
	const [isAuthModalOpen, setAuthModalOpen] = useState(false);
	const [user, setUser] = useState<any>(null); // Храним текущего пользователя
	const supabase = createClient();

	useEffect(() => {
		// Обновляем пользователя при изменении сессии
		const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user || null);
		});

		// Получаем текущего пользователя при первом рендере
		const fetchUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUser(data.user);
		};

		fetchUser();

		// Очистка подписки при размонтировании
		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase]);

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Ошибка при выходе:', error.message);
		} else {
			setUser(null); // Сбрасываем пользователя при выходе
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
			{user ? (
				<div>
					<p>Привет, {user.email}</p>
					<button
						onClick={handleLogout}
						className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
					>
						Выйти
					</button>
				</div>
			) : (
				<>
					<button
						onClick={() => setAuthModalOpen(true)}
						className="bg-blue-500 text-white px-4 py-2 rounded"
					>
						Вход / Регистрация
					</button>
					<AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
				</>
			)}
		</div>
	);
}
