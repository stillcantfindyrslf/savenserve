"use client";
import {
	Avatar,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Input, NavbarMenu, NavbarMenuItem, NavbarMenuToggle,
} from "@nextui-org/react";
import React from "react";
import {PiShoppingCartSimpleBold} from "react-icons/pi";
import {BiUser} from "react-icons/bi";
import {RxHamburgerMenu} from "react-icons/rx";
import {start} from "repl";
import useAuthStore from "@/store/useAuthStore";
import AuthModal from "@/components/AuthModal";


export const SearchIcon = ({size = 24, strokeWidth = 2, width, height, ...props}) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			focusable="false"
			height={height || size}
			role="presentation"
			viewBox="0 0 24 24"
			width={width || size}
			className="text-color-text"
			{...props}
		>
			<path
				d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
			<path
				d="M22 22L20 20"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={strokeWidth}
			/>
		</svg>
	);
};

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

const FloatingNavbar = () => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const { user, openAuthModal, handleLogout } = useAuthStore();

	return (
		<div className="fixed top-0 left-0 right-0 h-auto bg-background z-50">
			<div className="mt-5 mb-5 px-5 mx-auto z-50 max-w-7xl">
				<Navbar
					maxWidth="xl"
					className="px-4 rounded-2xl w-full h-20 bg-primary-color"
					isMenuOpen={isMenuOpen}
					onMenuOpenChange={setIsMenuOpen}
				>
					<RxHamburgerMenu size="24" className=" text-light-white-color cursor-pointer"
													 onClick={() => setIsMenuOpen(!isMenuOpen)}/>
					<NavbarContent>
						<NavbarBrand className="ml-2">
							<p className="text-light-white-color font-bold text-2xl">SaveNServe</p>
						</NavbarBrand>
						<div className="hidden sm:block w-full ml-8 mr-20">
							<Input
								isClearable
								fullWidth="true"
								placeholder="Искать Продукты, Овощи или Мясо..."
								size="xl"
								radius="full"
								startContent={<SearchIcon size={18}/>}
								type="search"
							/>
						</div>
						<p className="text-light-white-color text-small max-w-42 whitespace-nowrap">
							Заказывай и получи в <span className="text-secondary-color"> течении 15 мин!</span>
						</p>
						<Button
							isIconOnly
							className="bg-light-white-color text-black p-2.5 rounded-full shadow-lg hover:bg-gray-200"
							aria-label="Shopping Cart"
						>
							<PiShoppingCartSimpleBold className="text-color-text" size={28}/>
						</Button>
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Button
									isIconOnly
									className="bg-light-white-color text-black p-2.5 rounded-full shadow-lg hover:bg-gray-200"
									aria-label="User"
								>
									<BiUser className="text-color-text" size={28}/>
								</Button>
							</DropdownTrigger>
							<DropdownMenu className="text-gray-800" aria-label="Profile Actions" variant="flat">
									{user ? (
										<>
											<DropdownItem key="user" className="h-14 gap-2">
												<p className="font-semibold">Вошел как</p>
												<p>{user.email}</p>
											</DropdownItem>
											<DropdownItem key="logout" color="danger" onPress={handleLogout}>
												Выйти
											</DropdownItem>
										</>
									) : (
										<DropdownItem key="login" onPress={openAuthModal}>
											Войти
										</DropdownItem>
									)}
								<DropdownItem key="settings">My Settings</DropdownItem>
								<DropdownItem key="team_settings">Team Settings</DropdownItem>
								<DropdownItem key="analytics">Analytics</DropdownItem>
								<DropdownItem key="system">System</DropdownItem>
								<DropdownItem key="configurations">Configurations</DropdownItem>
								<DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
							</DropdownMenu>
						</Dropdown>
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
									size="lg"
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