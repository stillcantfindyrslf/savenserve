'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {Button, Checkbox, Input, Link} from "@nextui-org/react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLogin, setIsLogin] = useState(true);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<any>(null); // Хранение данных пользователя

	const supabase = createClient();

	// Функция для обработки входа/регистрации
	const handleAuth = async () => {
		setError('');
		setLoading(true);
		try {
			if (isLogin) {
				const { data, error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;
				setUser(data.user); // Сохраняем данные пользователя после входа
			} else {
				const { data, error } = await supabase.auth.signUp({ email, password });
				if (error) throw error;
				setUser(data.user); // Сохраняем данные пользователя после регистрации
			}
			onClose();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// Отслеживание изменений сессии пользователя
	useEffect(() => {
		const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user || null); // Обновляем пользователя при изменении сессии
		});

		// Получение текущего пользователя при загрузке компонента
		const getUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUser(data.user);
		};

		getUser();

		// Очистка подписки при размонтировании
		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase]);

	// Закрытие модального окна и сброс состояния
	const handleClose = () => {
		setEmail('');
		setPassword('');
		setError('');
		setIsLogin(true);
		onClose();
	};

	if (!isOpen) return null;

	const MailIcon = (props) => {
		return (
			<svg
				aria-hidden="true"
				fill="none"
				focusable="false"
				height="1em"
				role="presentation"
				viewBox="0 0 24 24"
				width="1em"
				{...props}
			>
				<path
					d="M17 3.5H7C4 3.5 2 5 2 8.5V15.5C2 19 4 20.5 7 20.5H17C20 20.5 22 19 22 15.5V8.5C22 5 20 3.5 17 3.5ZM17.47 9.59L14.34 12.09C13.68 12.62 12.84 12.88 12 12.88C11.16 12.88 10.31 12.62 9.66 12.09L6.53 9.59C6.21 9.33 6.16 8.85 6.41 8.53C6.67 8.21 7.14 8.15 7.46 8.41L10.59 10.91C11.35 11.52 12.64 11.52 13.4 10.91L16.53 8.41C16.85 8.15 17.33 8.2 17.58 8.53C17.84 8.85 17.79 9.33 17.47 9.59Z"
					fill="currentColor"
				/>
			</svg>
		);
	};

	const LockIcon = (props) => {
		return (
			<svg
				aria-hidden="true"
				fill="none"
				focusable="false"
				height="1em"
				role="presentation"
				viewBox="0 0 24 24"
				width="1em"
				{...props}
			>
				<path
					d="M12.0011 17.3498C12.9013 17.3498 13.6311 16.6201 13.6311 15.7198C13.6311 14.8196 12.9013 14.0898 12.0011 14.0898C11.1009 14.0898 10.3711 14.8196 10.3711 15.7198C10.3711 16.6201 11.1009 17.3498 12.0011 17.3498Z"
					fill="currentColor"
				/>
				<path
					d="M18.28 9.53V8.28C18.28 5.58 17.63 2 12 2C6.37 2 5.72 5.58 5.72 8.28V9.53C2.92 9.88 2 11.3 2 14.79V16.65C2 20.75 3.25 22 7.35 22H16.65C20.75 22 22 20.75 22 16.65V14.79C22 11.3 21.08 9.88 18.28 9.53ZM12 18.74C10.33 18.74 8.98 17.38 8.98 15.72C8.98 14.05 10.34 12.7 12 12.7C13.66 12.7 15.02 14.06 15.02 15.72C15.02 17.39 13.67 18.74 12 18.74ZM7.35 9.44C7.27 9.44 7.2 9.44 7.12 9.44V8.28C7.12 5.35 7.95 3.4 12 3.4C16.05 3.4 16.88 5.35 16.88 8.28V9.45C16.8 9.45 16.73 9.45 16.65 9.45H7.35V9.44Z"
					fill="currentColor"
				/>
			</svg>
		);
	};

	return (
		<Modal isOpen={isOpen} placement="top-center" onClose={onClose}>
			<ModalContent className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">{isLogin ? 'Вход' : 'Регистрация'}</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<ModalBody className="flex flex-col gap-3 px-0 py-0">
					<Input
						endContent={
							<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
						}
						type="email"
						label="Email"
						placeholder="Введите email"
						variant="bordered"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						endContent={
							<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
						}
						label="Пароль"
						type="password"
						placeholder="Введите пароль"
						variant="bordered"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button
						onPress={handleAuth}
						disabled={loading}
						className={`w-full  mb-3 ${
							loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
						}`}
					>
						{loading ? 'Обработка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
					</Button>
				</ModalBody>

				<p className="text-sm text-center">
					{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
					<span
						onClick={() => setIsLogin(!isLogin)}
						className="text-blue-500 cursor-pointer underline"
					>
            {isLogin ? 'Регистрация' : 'Войти'}
          </span>
				</p>
				<button onClick={handleClose} className="mt-4 text-gray-500 block mx-auto">
					Закрыть
				</button>
			</ModalContent>
		</Modal>
	);
};