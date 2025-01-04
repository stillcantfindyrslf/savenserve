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

const AppNavbar = () => {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	return (
		<div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-5xl bg-primary-color rounded-2xl">
			<Navbar className="px-3 rounded-2xl h-20" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
					<RxHamburgerMenu size="24" className="text-light-white-color cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}/>
				<NavbarContent>
					<NavbarBrand className="ml-2">
						<p className="hidden sm:block text-light-white-color font-bold text-2xl">Logotype</p>
					</NavbarBrand>
					<Input
						isClearable
						fullWidth="true"
						placeholder="Искать Продукты, Овощи, или Мясо..."
						size="xl"
						radius="full"
						startContent={<SearchIcon size={18}/>}
						type="search"
					/>
					<p className="text-light-white-color text-small max-w-42 whitespace-nowrap">
						Заказывай и получи в <span className="text-secondary-color"> течении 15 мин!</span>
					</p>
					<Button
						isIconOnly
						className="bg-white text-black p-2.5 rounded-full shadow-lg hover:bg-gray-200"
						aria-label="Shopping Cart"
					>
						<PiShoppingCartSimpleBold className="text-color-text" size={28}/>
					</Button>
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Button
								isIconOnly
								className="bg-white text-black p-2.5 rounded-full shadow-lg hover:bg-gray-200"
								aria-label="User"
							>
								<BiUser className="text-color-text" size={28}/>
							</Button>
						</DropdownTrigger>
						<DropdownMenu className="text-gray-800" aria-label="Profile Actions" variant="flat">
							<DropdownItem key="profile" className="h-14 gap-2">
								<p className="font-semibold">Signed in as</p>
								<p className="font-semibold">zoey@example.com</p>
							</DropdownItem>
							<DropdownItem key="settings">My Settings</DropdownItem>
							<DropdownItem key="team_settings">Team Settings</DropdownItem>
							<DropdownItem key="analytics">Analytics</DropdownItem>
							<DropdownItem key="system">System</DropdownItem>
							<DropdownItem key="configurations">Configurations</DropdownItem>
							<DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
							<DropdownItem key="logout" color="danger">
								Log Out
							</DropdownItem>
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
	);
};

export default AppNavbar;