'use client';
import {Geist, Geist_Mono, Montserrat} from "next/font/google";
import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";
import useAuthStore from "@/store/useAuthStore";
import {useEffect} from "react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});



export default function RootLayout({
																		 children,
																	 }: Readonly<{
	children: React.ReactNode;
}>) {

	const { subscribeToAuthChanges } = useAuthStore();

	useEffect(() => {
		subscribeToAuthChanges();
	}, []);

	return (
		<html lang="en" className="bg-background-color">
			<body
				className={`${montserrat.variable}`}
			>
				<NextUIProvider>
					{children}
				</NextUIProvider>
			</body>
		</html>
	);
}