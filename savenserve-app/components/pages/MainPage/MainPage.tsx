'use client';

import AppSlider from "@/components/AppSlider";
import FloatingNavbar from "@/components/molecules/FloatingNavbar";

export default function MainPage() {
	return (
		<div className="max-w-7xl mx-auto px-5">
			<FloatingNavbar />
			<AppSlider />
		</div>
	);
}