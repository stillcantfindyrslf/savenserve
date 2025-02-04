import {Button, Input} from "@nextui-org/react";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import useAuthStore from "@/store/useAuthStore";
import {FcGoogle} from "react-icons/fc";
import {MailFilledIcon, LockFilledIcon} from "@nextui-org/shared-icons";
import {IoCloseOutline} from "react-icons/io5";
import React from "react";

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

	const handleSubmit = async () => {
		await handleAuth(email, password);
	};

	return (
		<Modal
			radius="3xl"
			isOpen={isAuthModalOpen}
			onClose={closeAuthModal}
			className="p-1.5"
			closeButton={<div><IoCloseOutline className="h-8 w-8" onClick={closeAuthModal}/></div>}
		>
			<ModalContent>
				<ModalHeader>
					<h2 className="text-xl font-bold">{isLogin ? 'Вход' : 'Регистрация'}</h2>
				</ModalHeader>
				<ModalBody className="flex flex-col gap-3">
					{error && <p className="text-red-500">{error}</p>}
					<Input
						endContent={
							<MailFilledIcon className="text-3xl text-default-400 pointer-events-none"/>
						}
						label="Email"
						type="email"
						placeholder="Введите email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						variant="bordered"
					/>
					<Input
						endContent={
							<LockFilledIcon className="text-3xl text-default-400 pointer-events-none"/>
						}
						label="Пароль"
						type="password"
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
						className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
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
						<FcGoogle size={20}/> Войти через Google
					</Button>
					<p className="text-sm text-center py-2 mb-1">
						{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
						<span onClick={toggleAuthMode} className="text-blue-500 cursor-pointer">
              {isLogin ? 'Регистрация' : 'Войти'}
            </span>
					</p>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AuthModal;