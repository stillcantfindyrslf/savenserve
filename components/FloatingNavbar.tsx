"use client";

import React from "react";
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
	Input,
	NavbarMenu,
	NavbarMenuItem,
	Avatar,
	Badge
} from "@nextui-org/react";
import Link from 'next/link'
import { PiShoppingCartSimpleBold, PiPlantFill } from "react-icons/pi";
import { BiUser } from "react-icons/bi";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { FiSearch } from "react-icons/fi";
import useAuthStore from "@/store/useAuthStore";
import useCartStore from "@/store/useCartStore";
import AuthModal from "@/components/AuthModal";
import { toast } from "sonner";

const menuItems = [
	"Profile",
	"Dashboard",
	"Activity",
	"Analytics",
	"System",
	"Deployments",
	"My Settings",
	"Team Settings",
	"Help & Feedback",
	"Log Out",
];

interface NavbarProps {
	title?: string;
	subtitle?: boolean;
	subtitleCart?: boolean;
	showSearch?: boolean;
	showCart?: boolean;
	showUserMenu?: boolean;
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

const FloatingNavbar: React.FC<NavbarProps> = ({
	title = "SaveNServe",
	subtitle = true,
	subtitleCart = false,
	showSearch = true,
	showCart = true,
	showUserMenu = true,
	searchQuery,
	setSearchQuery
}) => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const { user, openAuthModal, handleLogout } = useAuthStore();
	const { cartItems } = useCartStore();

	const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

	const getUserAvatarContent = () => {
		if (!user) return <BiUser className="text-color-text" size={28} />;

		if (user.user_metadata?.avatar_url) {
			return null;
		}

		const name = user.user_metadata?.name || user.email || '';
		const initials = name
			.split(' ')
			.map((n: string) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);

		return initials;
	};

	const userAvatarUrl = user?.user_metadata?.avatar_url || null;

	const handleCartClick = () => {
		if (!user) {
			toast.warning("Нужно войти, чтобы увидеть корзину.")
			return;
		}
		window.location.href = "/cart";
	};

	return (
		<div className="fixed top-0 left-0 right-0 h-auto bg-background-color z-50">
			<div className="mt-5 mb-5 px-5 mx-auto z-50 max-w-7xl">
				<Navbar
					maxWidth="xl"
					className="px-4 rounded-2xl w-full h-20 bg-primary-color"
					isMenuOpen={isMenuOpen}
					onMenuOpenChange={setIsMenuOpen}
				>
					<RxHamburgerMenu
						size="24"
						className="text-light-white-color cursor-pointer"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
					<NavbarContent>
						<NavbarBrand className="ml-2">
							<Link href="/" className="flex items-center">
								<PiPlantFill className="text-secondary-color mr-3	" size={32} />
								<p className="text-light-white-color font-bold text-2xl">{title}</p>
							</Link>
						</NavbarBrand>
						{showSearch && (
							<div className="hidden sm:block w-full ml-8 mr-20">
								<Input
									isClearable
									fullWidth
									placeholder="Искать Продукты, Овощи или Мясо..."
									size="lg"
									radius="full"
									startContent={<FiSearch size={24} className="text-primary-color" />}
									type="search"
									value={searchQuery}
									onChange={(e) => { setSearchQuery(e.target.value) }}
									onClear={() => setSearchQuery("")}
								/>
							</div>
						)}
						{subtitle && (
							<p className="text-light-white-color text-small max-w-42 whitespace-nowrap">
								Заказывай и получи <span className="text-secondary-color">в течении 15 мин!</span>
							</p>
						)}
						{subtitleCart && (
							<Link href="/" className="flex gap-3">
								<p className="text-light-white-color text-md max-w-42 whitespace-nowrap">
									Продолжить <span className="text-secondary-color">покупки</span>
								</p>
								<RxCross2 size={25} className="text-light-white-color" />
							</Link>
						)}
						{showCart && (
							<Badge
								content={totalItemsInCart > 0 ? totalItemsInCart : null}
								color="danger"
								shape="circle"
								size="md"
								classNames={{
									badge: "bg-red-400 text-white font-bold"
								}}
								placement="top-right"
								isInvisible={totalItemsInCart === 0}
							>
								<Button
									isIconOnly
									className="bg-light-white-color text-black p-2.5 rounded-full shadow-lg hover:bg-gray-200"
									aria-label={`Shopping Cart with ${totalItemsInCart} items`}
									onPress={handleCartClick}
								>
									<PiShoppingCartSimpleBold className="text-color-text" size={30} />
								</Button>
							</Badge>
						)}
						{showUserMenu && (
							<Dropdown placement="bottom-end">
								<DropdownTrigger>
									{user ? (
										<div className="relative">
											<Avatar
												as="button"
												src={userAvatarUrl || undefined}
												showFallback
												name={getUserAvatarContent()}
												size="md"
												radius="full"
												isBordered
												color="success"
											/>
										</div>
									) : (
										<Button
											isIconOnly
											className="bg-light-white-color text-black p-2.5 rounded-full shadow-lg hover:bg-gray-200"
											aria-label="User"
										>
											<BiUser className="text-color-text" size={28} />
										</Button>
									)}
								</DropdownTrigger>
								<DropdownMenu
									className="text-gray-800"
									aria-label="Profile Actions"
									variant="flat"
								>
									{user ? (
										<>
											<DropdownItem key="user" className="h-14 gap-2">
												<p className="font-semibold">Вошел как</p>
												<p>{user.email}</p>
											</DropdownItem>
											<DropdownItem key="profile"  href="/profile">Профиль</DropdownItem>
											<DropdownItem key="favorites"  href="/favorites">Понравившееся</DropdownItem>
											<DropdownItem key="admin"  href="/admin">Админ панель</DropdownItem>
											<DropdownItem key="logout" color="danger" onPress={handleLogout}>
												Выйти
											</DropdownItem>
										</>
									) : (
										<DropdownItem key="login" onPress={openAuthModal}>
											Войти
										</DropdownItem>
									)}
								</DropdownMenu>
							</Dropdown>
						)}
					</NavbarContent>
					<NavbarMenu>
						{menuItems.map((item, index) => (
							<NavbarMenuItem key={`${item}-${index}`}>
								<Link
									className="w-full"
									color={
										index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
									}
									href="#"
								>
									{item}
								</Link>
							</NavbarMenuItem>
						))}
					</NavbarMenu>
				</Navbar>
			</div>
			<AuthModal />
		</div>
	);
};

export default FloatingNavbar;