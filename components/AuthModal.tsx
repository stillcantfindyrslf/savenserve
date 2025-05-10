import { Button, Input } from "@nextui-org/react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import useAuthStore from "@/store/useAuthStore";
import { FcGoogle } from "react-icons/fc";
import { MailFilledIcon, LockFilledIcon, EyeSlashFilledIcon, EyeFilledIcon } from "@nextui-org/shared-icons";
import { IoCloseOutline } from "react-icons/io5";
import React, { useState } from "react";

const AuthModal = () => {
	const {
		isAuthModalOpen,
		closeAuthModal,
		toggleAuthMode,
		handleAuth,
		setEmail,
		setPassword,
		email,
		password,
		signInWithGoogle,
		isLogin,
		loading,
		error,
	} = useAuthStore();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

	const handleSubmit = async () => {
		if (!email.includes('@')) {
			useAuthStore.setState({ error: 'Пожалуйста, укажите корректный email. В адресе должен быть символ @.' });
			return;
		}

		if (password.length < 6) {
			useAuthStore.setState({ error: 'Пароль должен содержать не менее 6 символов' });
			return;
		}

		await handleAuth(email, password);
	};

	return (
		<Modal
			radius="lg"
			isOpen={isAuthModalOpen}
			onClose={closeAuthModal}
			className="p-0.5"
			closeButton={<div><IoCloseOutline className="h-8 w-8" onClick={closeAuthModal} /></div>}
		>
			<ModalContent>
				<ModalHeader>
					<h2 className="text-xl font-bold">{isLogin ? 'Вход' : 'Регистрация'}</h2>
				</ModalHeader>
				<ModalBody className="flex flex-col gap-3">
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<Input
						endContent={
							<MailFilledIcon className="text-3xl text-default-400 pointer-events-none" />
						}
						label="Email"
						type="email"
						placeholder="Введите email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						variant="bordered"
						errorMessage={!email.includes('@') && email.length > 0 ? "В адресе должен быть символ @" : ""}
						isInvalid={!email.includes('@') && email.length > 0}
					/>
					<Input
						endContent={
							password.length > 0 ? (
								<button
									className="focus:outline-none"
									type="button"
									onClick={togglePasswordVisibility}
								>
									{isPasswordVisible ? (
										<EyeSlashFilledIcon className="text-3xl text-default-400 pointer-events-none" />
									) : (
										<EyeFilledIcon className="text-3xl text-default-400 pointer-events-none" />
									)}
								</button>
							) : (
								<LockFilledIcon className="text-3xl text-default-400 pointer-events-none" />
							)
						}
						label="Пароль"
						type={isPasswordVisible ? "text" : "password"}
						placeholder="Введите пароль"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						variant="bordered"
					/>
				</ModalBody>
				<ModalFooter className="flex-col py-1 gap-3">
					<Button
						disabled={loading}
						onPress={handleSubmit}
						className={`w-full ${loading ? 'bg-gray-400' : 'bg-primary-color text-white'}`}
					>
						{loading ? 'Обработка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
					</Button>
					<div
						className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
						<span className="relative z-10 bg-background px-2 text-muted-foreground">
							или
						</span>
					</div>
					<Button
						onPress={signInWithGoogle}
						className="w-full bg-white text-black border border-gray-300 flex items-center justify-center gap-2"
						disabled={loading}
					>
						<FcGoogle size={20} /> Войти через Google
					</Button>
					<p className="text-sm text-center py-2 mb-1">
						{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
						<span onClick={toggleAuthMode} className="text-primary-color hover:underline cursor-pointer">
							{isLogin ? 'Регистрация' : 'Войти'}
						</span>
					</p>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AuthModal;