import {Geist, Geist_Mono, Montserrat} from "next/font/google";
import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";

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
	return (
		<html lang="en" className="bg-background">
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