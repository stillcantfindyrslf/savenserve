import { Montserrat } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { Metadata } from "next";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: 'SaveNServe',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="ru" className="bg-background-color">
			<body
				className={`${montserrat.variable}`}
			>
				<AuthProvider>
					<NextUIProvider>
						<Toaster position='bottom-right' richColors closeButton expand visibleToasts={1} duration={3000} />
						<div className="max-w-7xl mx-auto px-5">
							{children}
						</div>
						<Footer />
					</NextUIProvider>
				</AuthProvider>
			</body>
		</html>
	);
}